import fs from "fs";
import path from "path";
import { defineConfig } from "vite";
import banner from "vite-plugin-banner";

import PACKAGE from "./package.json";

if (PACKAGE.name == null) {
  throw new Error("'name' property missing from package.json");
}

const pkgName = PACKAGE.name;
const pkgNameCamel = pkgName.replace(/(?<=-)./g, char => char.toUpperCase());

const dirs = {
  es: "esm",
  cjs: "cjs",
} as const;

const exts = {
  es: "mjs",
  cjs: "cjs",
} as const;

const formats = Object.keys(dirs) as Array<keyof typeof dirs>;

// https://vitejs.dev/config/
const config = defineConfig({
  base: "./",
  build: {
    emptyOutDir: false,
    minify: false,
    lib: {
      entry: path.resolve(__dirname, "src/index.ts"),
      fileName: format => {
        const min = config.build?.minify ? ".min" : "";
        return `${dirs[format]}/${pkgName}${min}.${exts[format]}`;
      },
      formats,
      name: pkgNameCamel,
    },
    sourcemap: true,
  },
  plugins: [
    banner({
      content: fs.readFileSync(path.resolve(__dirname, "NOTICE"), "utf-8"),
    }),
  ],
  test: {
    coverage: {
      exclude: ["tests/**/*", "**/*.d.ts"],
    },
  },
});

export default config;
