import os from "os";

import { afterAll, beforeAll, describe, expect, test } from "@jest/globals";
import Piscina from "piscina";

import type { Runner } from "../src/types/async";
import type { MatrixLike } from "../src/types/matrixLike";
import { map } from "../src/utils/matrix";

import type { MunkresAsyncFn, MunkresFn } from "./types";
import testsJson from "./tests.json";
import { oneOf } from "./utils";

type SuiteName = keyof typeof testsJson.suites;

interface Config {
  suites: Record<SuiteName, Suite>;
}

interface Suite {
  name: string;
  tests: Test[];
}

interface Test {
  name: string;
  input: number[][];
  output?: [number, number][];
  outputs?: [number, number][][];
}

export interface Options {
  isBigInt?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  matrixTransform?: (matrix: MatrixLike<any>) => MatrixLike<any>;
}

export function runSuite(
  suiteName: SuiteName,
  munkres: MunkresFn,
  options?: Options,
): void {
  options ??= {};
  options.isBigInt ??= false;
  const config = testsJson as unknown as Config;
  const suite = config.suites[suiteName];
  if (suite == null) {
    throw new Error(`invalid suite name '${suiteName}'`);
  }
  describe(`${munkres.name} | ${suite.name}`, () => {
    for (const tst of suite.tests) {
      test(tst.name, () => {
        let matrix: MatrixLike<unknown> = map(tst.input, (v) => Number(v));
        matrix = options.isBigInt
          ? map(matrix, (v) => BigInt(v as number))
          : matrix;
        if (options.matrixTransform != null) {
          matrix = options.matrixTransform(matrix);
        }
        const actual = munkres(matrix);
        if (tst.output) {
          expect(new Map(actual)).toEqual(new Map(tst.output));
        } else if (tst.outputs) {
          oneOf(
            new Map(actual),
            tst.outputs.map((pairs) => new Map(pairs)),
          );
        } else {
          throw new Error(`No expected output defined.`);
        }
      });
    }
  });
}

export function runSuiteAsync(
  suiteName: SuiteName,
  munkres: MunkresAsyncFn,
  options?: Options,
): void {
  options ??= {};
  options.isBigInt ??= false;

  const config = testsJson as unknown as Config;
  const suite = config.suites[suiteName];
  if (suite == null) {
    throw new Error(`invalid suite name '${suiteName}'`);
  }
  describe(`${munkres.name} | ${suite.name}`, () => {
    let pool: Piscina;
    let runner: Runner<unknown>;

    beforeAll(() => {
      pool = new Piscina({
        filename: "./examples/piscina/worker.js",
        maxThreads: os.availableParallelism(),
      });

      runner = {
        size: pool.maxThreads,
        match: (matching) => pool.run(matching, { name: "match" }),
      };
    });

    afterAll(() => pool.destroy());

    for (const tst of suite.tests) {
      test(tst.name, async () => {
        let matrix: MatrixLike<unknown> = map(tst.input, (v) => Number(v));
        matrix = options.isBigInt
          ? map(matrix, (v) => BigInt(v as number))
          : matrix;
        if (options.matrixTransform != null) {
          matrix = options.matrixTransform(matrix);
        }
        const actual = await munkres(matrix, runner);
        if (tst.output) {
          expect(new Map(actual)).toEqual(new Map(tst.output));
        } else if (tst.outputs) {
          oneOf(
            new Map(actual),
            tst.outputs.map((pairs) => new Map(pairs)),
          );
        } else {
          throw new Error(`No expected output defined.`);
        }
      });
    }
  });
}
