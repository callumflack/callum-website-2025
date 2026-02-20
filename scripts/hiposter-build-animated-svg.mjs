import { promises as fs } from "fs";
import path from "path";

const DEFAULT_INPUT = "public/images/hiposter-pymupdf.svg";
const DEFAULT_OUTPUT = "public/images/hiposter-artwork-animated.svg";

function usage() {
  console.log("Usage: node scripts/hiposter-build-animated-svg.mjs [input.svg] [output.svg]");
}

function addOrAppendAttr(tag, attr, value) {
  const attrRegex = new RegExp(`${attr}="([^"]*)"`);
  const match = tag.match(attrRegex);
  if (!match) {
    return tag.replace("<path", `<path ${attr}="${value}"`);
  }
  const updated = `${match[1]} ${value}`.trim();
  return tag.replace(attrRegex, `${attr}="${updated}"`);
}

function upsertAttr(tag, attr, value) {
  const attrRegex = new RegExp(`${attr}="([^"]*)"`);
  if (!tag.match(attrRegex)) {
    return tag.replace("<path", `<path ${attr}="${value}"`);
  }
  return tag.replace(attrRegex, `${attr}="${value}"`);
}

function upsertStyleVars(tag, delaySeconds, durationSeconds) {
  const styleRegex = /style="([^"]*)"/;
  const styleVars = `--delay:${delaySeconds.toFixed(2)}s;--dur:${durationSeconds.toFixed(2)}s`;
  if (!tag.match(styleRegex)) {
    return tag.replace("<path", `<path style="${styleVars}"`);
  }
  return tag.replace(styleRegex, (_full, current) => {
    const suffix = current.trim().endsWith(";") ? "" : ";";
    return `style="${current}${suffix}${styleVars}"`;
  });
}

function addAnimationStyle(svg) {
  const styleBlock = `
<style id="hiposter-animation-style">
  .draw {
    fill: none !important;
    stroke: #111 !important;
    stroke-width: 1;
    stroke-linecap: round;
    stroke-linejoin: round;
    vector-effect: non-scaling-stroke;
    stroke-dasharray: 1000;
    stroke-dashoffset: 1000;
    animation: draw var(--dur) ease forwards;
    animation-delay: var(--delay);
  }
  @keyframes draw { to { stroke-dashoffset: 0; } }
</style>`.trim();

  return svg.replace(/<svg[^>]*>/, (openTag) => `${openTag}\n${styleBlock}`);
}

async function run() {
  const [, , inputArg, outputArg] = process.argv;
  if (inputArg === "--help" || inputArg === "-h") {
    usage();
    return;
  }

  const inputPath = inputArg ?? DEFAULT_INPUT;
  const outputPath = outputArg ?? DEFAULT_OUTPUT;
  const inputAbs = path.resolve(process.cwd(), inputPath);
  const outputAbs = path.resolve(process.cwd(), outputPath);

  let svg = await fs.readFile(inputAbs, "utf8");
  svg = addAnimationStyle(svg);

  let pathIndex = 0;
  svg = svg.replace(/<path\b[^>]*>/g, (tag) => {
    const tilePhase = (pathIndex % 9) * 0.09;
    const delay = tilePhase + pathIndex * 0.003;
    const duration = 0.9 + (((Math.sin((pathIndex + 1) * 19) + 1) / 2) * 1.6);

    let nextTag = addOrAppendAttr(tag, "class", "draw");
    nextTag = upsertAttr(nextTag, "pathLength", "1000");
    nextTag = upsertStyleVars(nextTag, delay, duration);
    pathIndex += 1;
    return nextTag;
  });

  await fs.mkdir(path.dirname(outputAbs), { recursive: true });
  await fs.writeFile(outputAbs, svg, "utf8");

  console.log(`Input: ${path.relative(process.cwd(), inputAbs)}`);
  console.log(`Output: ${path.relative(process.cwd(), outputAbs)}`);
  console.log(`Animated paths: ${pathIndex}`);
}

run().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
