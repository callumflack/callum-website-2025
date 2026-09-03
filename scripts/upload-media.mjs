import { createHash } from "node:crypto";
import { createReadStream, statSync } from "node:fs";
import { basename, resolve } from "node:path";

const REQUIRED_ENV = [
  "BUNNY_STORAGE_ZONE",
  "BUNNY_STORAGE_API_KEY",
  "BUNNY_STORAGE_HOST",
  "BUNNY_CDN_URL",
];

export function parseArgs(args) {
  let localFile;
  let remotePath;
  let poster;
  let aspect;
  let force = false;

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];

    if (arg === "--force") {
      force = true;
    } else if (["--to", "--poster", "--aspect"].includes(arg)) {
      const value = args[index + 1];
      if (!value || value.startsWith("--")) {
        throw new Error(`${arg} requires a value`);
      }
      if (arg === "--to") remotePath = value;
      if (arg === "--poster") poster = value;
      if (arg === "--aspect") aspect = value;
      index += 1;
    } else if (arg.startsWith("--")) {
      throw new Error(`Unknown option: ${arg}`);
    } else if (localFile) {
      throw new Error(`Unexpected argument: ${arg}`);
    } else {
      localFile = arg;
    }
  }

  if (!localFile) {
    throw new Error(
      "Usage: bun media:upload <local-file> [--to <remote-path>] [--force] [--poster <public-path> --aspect <width-height>]",
    );
  }

  if ((poster && !aspect) || (aspect && !poster)) {
    throw new Error("--poster and --aspect must be supplied together");
  }
  if (aspect && !/^\d+-\d+$/.test(aspect)) {
    throw new Error("--aspect must use pixel dimensions such as 1920-1080");
  }

  return {
    localFile,
    remotePath: remotePath ?? basename(localFile),
    force,
    poster,
    aspect,
  };
}

function normalizeRemotePath(value) {
  const path = value.replace(/^\/+/, "");
  const segments = path.split("/");

  if (
    !path ||
    path.endsWith("/") ||
    segments.some((segment) => !segment || segment === "." || segment === "..")
  ) {
    throw new Error(`Invalid remote path: ${value}`);
  }

  return segments.map(encodeURIComponent).join("/");
}

function getConfig(env) {
  const missing = REQUIRED_ENV.filter((name) => !env[name]?.trim());
  if (missing.length) {
    throw new Error(`Missing environment variables: ${missing.join(", ")}`);
  }

  const storageHost = env.BUNNY_STORAGE_HOST.trim();
  if (storageHost.includes("/") || storageHost.includes(":")) {
    throw new Error("BUNNY_STORAGE_HOST must be a hostname");
  }

  let cdnUrl;
  try {
    cdnUrl = new URL(env.BUNNY_CDN_URL);
  } catch {
    throw new Error("BUNNY_CDN_URL must be a valid HTTPS URL");
  }
  if (cdnUrl.protocol !== "https:") {
    throw new Error("BUNNY_CDN_URL must be a valid HTTPS URL");
  }

  return {
    zone: env.BUNNY_STORAGE_ZONE.trim(),
    apiKey: env.BUNNY_STORAGE_API_KEY.trim(),
    storageHost,
    cdnBase: cdnUrl.toString().replace(/\/$/, ""),
  };
}

async function sha256(filePath) {
  const hash = createHash("sha256");
  for await (const chunk of createReadStream(filePath)) hash.update(chunk);
  return hash.digest("hex").toUpperCase();
}

async function assertResponse(response, action) {
  if (response.ok) return;
  const detail = await response.text().catch(() => "");
  throw new Error(
    `${action} failed (${response.status})${detail ? `: ${detail}` : ""}`,
  );
}

async function listDirectory(fetchImpl, directoryUrl, headers) {
  const response = await fetchImpl(directoryUrl, { method: "GET", headers });
  await assertResponse(response, "Storage directory listing");
  const entries = await response.json();
  if (!Array.isArray(entries)) {
    throw new Error("Storage directory listing returned an invalid response");
  }
  return entries;
}

function findFile(entries, fileName) {
  return entries.find(
    (entry) => entry?.ObjectName === fileName && entry?.IsDirectory === false,
  );
}

export async function uploadMedia(
  args,
  { env = process.env, fetchImpl = fetch, stdout = console.log } = {},
) {
  const {
    localFile,
    remotePath: rawRemotePath,
    force,
    poster,
    aspect,
  } = parseArgs(args);
  const filePath = resolve(localFile);
  let stat;
  try {
    stat = statSync(filePath);
  } catch {
    throw new Error(`Local file does not exist: ${localFile}`);
  }
  if (!stat.isFile()) throw new Error(`Local path is not a file: ${localFile}`);
  if (stat.size === 0) throw new Error(`Local file is empty: ${localFile}`);

  const config = getConfig(env);
  const remotePath = normalizeRemotePath(rawRemotePath);
  const storageUrl = `https://${config.storageHost}/${encodeURIComponent(config.zone)}/${remotePath}`;
  const lastSlash = remotePath.lastIndexOf("/");
  const parentPath = lastSlash === -1 ? "" : remotePath.slice(0, lastSlash + 1);
  const fileName = decodeURIComponent(remotePath.slice(lastSlash + 1));
  const directoryUrl = `https://${config.storageHost}/${encodeURIComponent(config.zone)}/${parentPath}`;
  const publicUrl = `${config.cdnBase}/${remotePath}`;
  const authHeaders = { AccessKey: config.apiKey };

  if (!force) {
    const entries = await listDirectory(fetchImpl, directoryUrl, authHeaders);
    if (findFile(entries, fileName)) {
      throw new Error(
        `Remote file already exists: ${publicUrl}\nUse --force to replace it.`,
      );
    }
  }

  const checksum = await sha256(filePath);
  const upload = await fetchImpl(storageUrl, {
    method: "PUT",
    headers: {
      ...authHeaders,
      Checksum: checksum,
      "Content-Type": "video/mp4",
    },
    body: Bun.file(filePath),
  });
  if (upload.status !== 201) {
    await assertResponse(upload, "Upload");
    throw new Error(`Upload returned unexpected status ${upload.status}`);
  }

  const uploadedEntries = await listDirectory(
    fetchImpl,
    directoryUrl,
    authHeaders,
  );
  const uploaded = findFile(uploadedEntries, fileName);
  if (
    !uploaded ||
    Number(uploaded.Length) !== stat.size ||
    String(uploaded.Checksum).toUpperCase() !== checksum
  ) {
    throw new Error("Storage verification failed: size or checksum mismatch");
  }

  const delivery = await fetchImpl(publicUrl, {
    method: "GET",
    headers: { Range: "bytes=0-0" },
  });
  await assertResponse(delivery, "Public delivery verification");
  await delivery.body?.cancel();

  stdout(publicUrl);
  if (poster && aspect) {
    stdout(
      `<Video\n  aspect="${aspect}"\n  src="${publicUrl}"\n  poster="${poster}"\n/>`,
    );
  } else {
    stdout(
      "Add --poster <public-path> and --aspect <width-height> to print a paste-ready <Video> snippet.",
    );
  }
  return { publicUrl, checksum };
}

if (import.meta.main) {
  try {
    await uploadMedia(process.argv.slice(2));
  } catch (error) {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  }
}
