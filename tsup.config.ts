import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { defineConfig } from "tsup";

// __dirname doesn't exist in ESM modules; derive it.
const __dirname = dirname(fileURLToPath(import.meta.url));

// Build the license banner from NOTICE (which uses ejs-style placeholders
// from the previous rollup-plugin-license config).
const pkg: { name: string; homepage: string; author: string } = JSON.parse(
  readFileSync(resolve(__dirname, "package.json"), "utf8"),
);
const notice = readFileSync(resolve(__dirname, "NOTICE"), "utf8");
const year = new Date().getFullYear();
const banner =
  "/*!\n" +
  notice
    .replaceAll("<%= pkg.name %>", pkg.name)
    .replaceAll("<%= pkg.homepage %>", pkg.homepage)
    .replaceAll(/<%=\s*moment\(\)\.format\('YYYY'\)\s*%>/g, String(year))
    .replaceAll("<%= pkg.author %>", pkg.author)
    .split("\n")
    .map((line) => ` * ${line}`.trimEnd())
    .join("\n") +
  "\n */";

export default defineConfig({
  // Named entry so output basenames are `munkres.{cjs,mjs,d.ts}` instead of
  // the default `index.*`.
  entry: { munkres: "src/index.ts" },
  format: ["cjs", "esm"],
  // With package.json "type": "module", tsup defaults cjs → .cjs and esm
  // → .js. The package's exports map requires .mjs for the ESM entry, so
  // override here.
  outExtension({ format }) {
    return { js: format === "cjs" ? ".cjs" : ".mjs" };
  },
  dts: true,
  sourcemap: true,
  // Wipe dist/ before each build (replaces the old `rimraf dist` step).
  clean: true,
  banner: { js: banner },
  // No runtime dependencies; everything in package.json is devDeps. tsup's
  // default of bundling the entry tree is fine — there's nothing external
  // to leave alone.
});
