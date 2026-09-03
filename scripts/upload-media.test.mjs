import { afterEach, describe, expect, mock, test } from "bun:test";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { uploadMedia } from "./upload-media.mjs";

const env = {
  BUNNY_STORAGE_ZONE: "site-media",
  BUNNY_STORAGE_API_KEY: "secret-key",
  BUNNY_STORAGE_HOST: "ny.storage.bunnycdn.com",
  BUNNY_CDN_URL: "https://media.example.com",
};

const tempDirectories = [];

function fixture(contents = "video bytes") {
  const directory = mkdtempSync(join(tmpdir(), "media-upload-"));
  tempDirectories.push(directory);
  const file = join(directory, "clip.mp4");
  writeFileSync(file, contents);
  return file;
}

afterEach(() => {
  for (const directory of tempDirectories.splice(0)) {
    rmSync(directory, { recursive: true, force: true });
  }
});

describe("media upload", () => {
  test("requires a local file", async () => {
    await expect(uploadMedia([], { env })).rejects.toThrow("Usage:");
  });

  test("requires Bunny configuration", async () => {
    await expect(uploadMedia([fixture()], { env: {} })).rejects.toThrow(
      "BUNNY_STORAGE_ZONE, BUNNY_STORAGE_API_KEY, BUNNY_STORAGE_HOST, BUNNY_CDN_URL",
    );
  });

  test("refuses to overwrite an existing remote file", async () => {
    const fetchImpl = mock(() =>
      Promise.resolve(
        Response.json([
          { ObjectName: "clip.mp4", IsDirectory: false },
        ]),
      ),
    );

    await expect(
      uploadMedia([fixture()], { env, fetchImpl }),
    ).rejects.toThrow("Use --force");
    expect(fetchImpl).toHaveBeenCalledTimes(1);
    expect(fetchImpl.mock.calls[0][1].method).toBe("GET");
  });

  test("uploads with a checksum, verifies delivery, and prints MDX", async () => {
    let uploadedChecksum;
    const fetchImpl = mock((url, options) => {
      if (options.method === "PUT") {
        uploadedChecksum = options.headers.Checksum;
        return Promise.resolve(new Response(null, { status: 201 }));
      }
      if (url.startsWith("https://media.example.com")) {
        return Promise.resolve(new Response("x", { status: 206 }));
      }
      const isPostUpload = Boolean(uploadedChecksum);
      return Promise.resolve(
        Response.json(
          isPostUpload
            ? [
                {
                  ObjectName: "my clip.mp4",
                  IsDirectory: false,
                  Length: 11,
                  Checksum: uploadedChecksum,
                },
              ]
            : [],
        ),
      );
    });
    const output = [];

    const result = await uploadMedia(
      [
        fixture(),
        "--to",
        "projects/my clip.mp4",
        "--poster",
        "/images/my-clip.jpg",
        "--aspect",
        "1920-1080",
      ],
      { env, fetchImpl, stdout: (line) => output.push(line) },
    );

    expect(fetchImpl).toHaveBeenCalledTimes(4);
    expect(fetchImpl.mock.calls[1][1].method).toBe("PUT");
    expect(fetchImpl.mock.calls[1][1].headers.Checksum).toBe(result.checksum);
    expect(fetchImpl.mock.calls[1][1].headers.AccessKey).toBe("secret-key");
    expect(fetchImpl.mock.calls[1][1].headers["Content-Type"]).toBe(
      "video/mp4",
    );
    expect(fetchImpl.mock.calls[3]).toEqual([
      "https://media.example.com/projects/my%20clip.mp4",
      { method: "GET", headers: { Range: "bytes=0-0" } },
    ]);
    expect(output.join("\n")).toContain(
      'src="https://media.example.com/projects/my%20clip.mp4"',
    );
    expect(output.join("\n")).toContain('aspect="1920-1080"');
    expect(output.join("\n")).toContain('poster="/images/my-clip.jpg"');
  });

  test("does not print incomplete MDX without poster metadata", async () => {
    const output = [];
    let checksum;

    await uploadMedia([fixture()], {
      env,
      fetchImpl: (url, options) => {
        if (options.method === "PUT") {
          checksum = options.headers.Checksum;
          return Promise.resolve(new Response(null, { status: 201 }));
        }
        if (url.startsWith("https://media.example.com")) {
          return Promise.resolve(new Response("x", { status: 206 }));
        }
        return Promise.resolve(
          Response.json(
            checksum
              ? [
                  {
                    ObjectName: "clip.mp4",
                    IsDirectory: false,
                    Length: 11,
                    Checksum: checksum,
                  },
                ]
              : [],
          ),
        );
      },
      stdout: (line) => output.push(line),
    });

    expect(output.join("\n")).not.toContain("<Video\n");
    expect(output.join("\n")).toContain("Add --poster");
  });

  test("fails when Bunny records the wrong uploaded checksum", async () => {
    let call = 0;
    const fetchImpl = () => {
      call += 1;
      if (call === 1) return Promise.resolve(Response.json([]));
      if (call === 2) {
        return Promise.resolve(new Response(null, { status: 201 }));
      }
      return Promise.resolve(
        Response.json([
          {
            ObjectName: "clip.mp4",
            IsDirectory: false,
            Length: 11,
            Checksum: "WRONG",
          },
        ]),
      );
    };

    await expect(
      uploadMedia([fixture()], { env, fetchImpl }),
    ).rejects.toThrow("size or checksum mismatch");
  });
});
