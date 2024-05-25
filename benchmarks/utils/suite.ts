import Bench, { Task } from "tinybench";

import type { SuiteConfig } from "../types/suiteConfig.ts";
import type { SuiteReporter } from "../types/suiteReporter.ts";

export class Suite extends EventTarget {
  protected benches: Map<string, Bench>;
  protected reporters: Set<SuiteReporter>;
  protected warmup: boolean;

  constructor(config: SuiteConfig = {}) {
    super();
    this.benches = new Map();
    this.reporters = new Set();
    this.warmup = config.warmup === true;
  }

  add(name: string, bench: Bench): this {
    this.benches.set(name, bench);
    return this;
  }

  addReporter(reporter: SuiteReporter): this {
    this.reporters.add(reporter);
    return this;
  }

  async run(): Promise<Bench[]> {
    for (const reporter of this.reporters) {
      this._setupSuiteReporting(reporter);
    }
    this.dispatchEvent(new Event("start"));
    for (const bench of this.benches.values()) {
      if (this.warmup) {
        await bench.warmup();
      }
      await bench.run();
      process.stdout.write(`\n`);
    }
    this.dispatchEvent(new Event("complete"));
    return Array.from(this.benches.values());
  }

  private _setupSuiteReporting(reporter: SuiteReporter): void {
    if (reporter.onSuiteStart != null) {
      this.addEventListener("start", () => reporter.onSuiteStart!(this));
    }
    if (reporter.onSuiteComplete != null) {
      this.addEventListener("complete", () => reporter.onSuiteComplete!(this));
    }
    for (const [name, bench] of this.benches) {
      this._setupBenchReporting(reporter, name, bench);
    }
  }

  private _setupBenchReporting(
    reporter: SuiteReporter,
    name: string,
    bench: Bench,
  ): void {
    if (reporter.onBenchWarmup != null) {
      bench.addEventListener("warmup", () =>
        reporter.onBenchWarmup!(bench, name),
      );
    }
    if (reporter.onBenchStart != null) {
      bench.addEventListener("start", () =>
        reporter.onBenchStart!(bench, name),
      );
    }
    if (reporter.onBenchComplete != null) {
      bench.addEventListener("complete", () =>
        reporter.onBenchComplete!(bench, name),
      );
    }
    for (const task of bench.tasks) {
      this._setupTaskReporting(reporter, task);
    }
  }

  private _setupTaskReporting(reporter: SuiteReporter, task: Task): void {
    if (reporter.onTaskStart != null) {
      task.addEventListener("start", () => reporter.onTaskStart!(task));
    }
    if (reporter.onTaskComplete != null) {
      task.addEventListener("complete", () => reporter.onTaskComplete!(task));
    }
  }
}
