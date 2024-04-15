import Bench from "tinybench";
import { BenchReporter } from "./benchReporter";

export interface SuiteConfig {
  warmup?: boolean;
}

export class Suite {
  protected benches: Map<string, Bench>;
  protected reporters: Set<BenchReporter>;
  protected warmup: boolean;

  constructor(config: SuiteConfig = {}) {
    this.benches = new Map();
    this.reporters = new Set();
    this.warmup = config.warmup === true;
  }

  add(name: string, bench: Bench): this {
    this.benches.set(name, bench);
    return this;
  }

  addReporter(reporter: BenchReporter): this {
    this.reporters.add(reporter);
    return this;
  }

  async run(): Promise<Bench[]> {
    for (const [name, bench] of this.benches) {
      this._setupReporters(name, bench);
      if (this.warmup) {
        await bench.warmup();
      }
      await bench.run();
      process.stdout.write(`\n`);
    }
    return Array.from(this.benches.values());
  }

  private _setupReporters(name: string, bench: Bench): void {
    for (const reporter of this.reporters) {
      if (reporter.onWarmup != null) {
        bench.addEventListener("warmup", () => reporter.onWarmup!(bench, name));
      }
      if (reporter.onStart != null) {
        bench.addEventListener("start", () => reporter.onStart!(bench, name));
      }
      if (reporter.onComplete != null) {
        bench.addEventListener("complete", () =>
          reporter.onComplete!(bench, name)
        );
      }
      for (const task of bench.tasks) {
        if (reporter.onTaskStart != null) {
          task.addEventListener("start", () => reporter.onTaskStart!(task));
        }
        if (reporter.onTaskComplete != null) {
          task.addEventListener("complete", () =>
            reporter.onTaskComplete!(task)
          );
        }
      }
    }
  }
}
