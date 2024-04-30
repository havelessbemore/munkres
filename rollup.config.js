import dts from "rollup-plugin-dts";
import esbuild from "rollup-plugin-esbuild";
import license from "rollup-plugin-license";

import pkg from "./package.json" with { type: "json" };

/**
 * @param {import('rollup').RollupOptions} config
 *
 * @returns {import('rollup').RollupOptions}
 */
function bundle(config) {
  return {
    ...config,
    input: "src/index.ts",
    external: (id) => !/^[./]/.test(id),
  };
}

/** @type {import('rollup-plugin-license').Options} */
const licenseConfig = {
  sourcemap: true,
  banner: {
    commentStyle: "ignored",
    content: {
      file: "./NOTICE",
    },
  },
  thirdParty: {
    output: {
      file: "dist/dependencies.txt",
    },
  },
};

export default [
  bundle({
    plugins: [esbuild(), license(licenseConfig)],
    output: [
      {
        file: pkg.main,
        format: "cjs",
        sourcemap: true,
        exports: "named",
      },
      {
        file: pkg.module,
        format: "es",
        sourcemap: true,
        exports: "named",
      },
    ],
  }),
  bundle({
    plugins: [dts()],
    output: {
      file: pkg.types,
      format: "es",
    },
  }),
];
