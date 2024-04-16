import { Suite } from "./suite";

export interface BenchReporter {
  onBenchWarmup?: (bench: Bench, name?: string) => void;
  onBenchStart?: (bench: Bench, name?: string) => void;
  onBenchComplete?: (bench: Bench, name?: string) => void;
  onTaskStart?: (task: Task) => void;
  onTaskComplete?: (task: Task) => void;
}

export interface SuiteReporter extends BenchReporter {
  onSuiteStart?: (suite: Suite) => void;
  onSuiteComplete?: (suite: Suite) => void;
}
