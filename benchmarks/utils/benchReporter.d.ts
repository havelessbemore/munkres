export interface BenchReporter {
  onWarmup?: (bench: Bench, name?: string) => void;
  onStart?: (bench: Bench, name?: string) => void;
  onComplete?: (bench: Bench, name?: string) => void;
  onTaskStart?: (task: Task) => void;
  onTaskComplete?: (task: Task) => void;
}
