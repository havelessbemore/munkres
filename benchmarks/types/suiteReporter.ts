import type { BenchReporter } from "./benchReporter.ts";

import { Suite } from "../utils/suite.ts";

export interface SuiteReporter extends BenchReporter {
  onSuiteStart?: (suite: Suite) => void;
  onSuiteComplete?: (suite: Suite) => void;
}
