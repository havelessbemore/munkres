import { describe, expect, test } from "@jest/globals";

import type { MatrixLike } from "../src/types/matrixLike";
import { map } from "../src/utils/matrix";

import type { MunkresFn, MunkresFnAsync } from "./types";
import testsJson from "./tests.json";
import { applyOptions, initOptions, oneOf } from "./utils";

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
  munkres: MunkresFn | MunkresFnAsync,
  options?: Options,
): void {
  options = initOptions(options);

  const config = testsJson as unknown as Config;
  const suite = config.suites[suiteName];
  if (suite == null) {
    throw new Error(`invalid suite name '${suiteName}'`);
  }
  describe(`${munkres.name} | ${suite.name}`, () => {
    for (const tst of suite.tests) {
      test(tst.name, async () => {
        let matrix: MatrixLike<unknown> = map(tst.input, (v) => Number(v));
        matrix = applyOptions(matrix, options);

        const actual = await munkres(matrix);
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
