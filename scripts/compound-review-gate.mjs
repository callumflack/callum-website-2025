import { execSync } from "child_process";

function run(command) {
  try {
    return execSync(command, { encoding: "utf8" }).trim();
  } catch {
    return "";
  }
}

function collectChangedFiles() {
  const staged = run("git diff --name-only --cached");
  const unstaged = run("git diff --name-only");
  const branchDiff = run("git diff --name-only origin/main...HEAD");

  const files = new Set(
    [staged, unstaged, branchDiff]
      .filter(Boolean)
      .flatMap((block) => block.split("\n"))
      .map((line) => line.trim())
      .filter(Boolean)
  );

  return Array.from(files);
}

function isPlanDoc(file) {
  return /^docs\/plans\/\d{6}-.+\.md$/.test(file);
}

function isSolutionDoc(file) {
  return /^docs\/solutions\/\d{6}-.+\.md$/.test(file);
}

function hasFeatureChanges(files) {
  return files.some((file) => {
    if (file.startsWith("docs/")) return false;
    if (file.startsWith("todos/")) return false;
    if (file === "AGENTS.md") return false;
    return true;
  });
}

function runGate() {
  const changedFiles = collectChangedFiles();
  const hasCodeOrConfigChanges = hasFeatureChanges(changedFiles);

  if (!hasCodeOrConfigChanges) {
    console.log("No feature/code changes detected; compound gate skipped.");
    return;
  }

  const hasPlan = changedFiles.some(isPlanDoc);
  const hasSolution = changedFiles.some(isSolutionDoc);

  const errors = [];

  if (!hasPlan) {
    errors.push(
      "Missing plan doc in docs/plans/ (expected docs/plans/YYMMDD-<slug>.md)"
    );
  }

  if (!hasSolution) {
    errors.push(
      "Missing solution doc in docs/solutions/ (expected docs/solutions/YYMMDD-<slug>.md)"
    );
  }

  if (errors.length) {
    console.error("Compound review gate failed:");
    for (const error of errors) {
      console.error(`- ${error}`);
    }
    process.exit(1);
  }

  console.log("Compound review gate passed.");
}

runGate();
