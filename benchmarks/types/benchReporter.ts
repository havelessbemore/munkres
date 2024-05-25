import Bench, { Task } from "tinybench";

export interface BenchReporter {
  onBenchWarmup?: (bench: Bench, name?: string) => void;
  onBenchStart?: (bench: Bench, name?: string) => void;
  onBenchComplete?: (bench: Bench, name?: string) => void;
  onTaskStart?: (task: Task) => void;
  onTaskComplete?: (task: Task) => void;
}
