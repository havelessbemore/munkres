import Bench, { Task } from "tinybench";

export interface SuiteConfig {
  warmup?: boolean;
}

export interface SuiteReporter {
  onWarmup?: (bench: Bench, name?: string) => void;
  onStart?: (bench: Bench, name?: string) => void;
  onComplete?: (bench: Bench, name?: string) => void;
  onTaskStart?: (task: Task) => void;
  onTaskComplete?: (task: Task) => void;
}

export class CIReporter implements SuiteReporter {
  constructor() {}

  onTaskComplete(task: Task): void {
    const res = task.result!;
    const runs = res.samples.length;
    const sb: string[] = [];
    sb.push(`${task.name} x`);
    sb.push(`${this._formatNumber(res.hz)} ops/sec`);
    sb.push(`±${res.rme.toFixed(2)}%`);
    sb.push(`(${runs} run${runs === 1 ? "" : "s"} sampled)`);
    console.log(sb.join(" "));
  }

  protected _formatNumber(v: number): string {
    const parts = v.toFixed(v < 100 ? 2 : 0).split(".");
    parts[0] = parts[0].replace(/(?=(?:\d{3})+$)(?!\b)/g, ",");
    return parts.join(".");
  }
}

export class ConsoleReporter implements SuiteReporter {
  protected results: Map<string, { [key: string]: unknown }>;
  protected columns: [string, (task: Task) => unknown][];

  constructor() {
    this.results = new Map();
    this.columns = [
      ["Name", task => task.name],
      ["Min (ms)", task => task.result?.min ?? ""],
      ["Max (ms)", task => task.result?.max ?? ""],
      ["Avg (ms)", task => task.result?.mean ?? ""],
      ["Samples", task => task.result?.samples?.length ?? ""],
    ];
  }

  onWarmup(bench: Bench, name?: string): void {
    name = name ?? "";
    process.stdout.write(`${name} (${bench.tasks.length}): Warming up...`);
  }

  onStart(bench: Bench, name?: string): void {
    name = name ?? "";
    process.stdout.clearLine(0);
    process.stdout.cursorTo(0);
    process.stdout.write(`${name} (${bench.tasks.length}): Running...\n`);
  }

  onComplete(bench: Bench, name?: string): void {
    const time = bench.tasks.reduce((sum, t) => sum + t.result!.totalTime, 0);
    const dy = 6 + this.results.size;
    process.stdout.write(`Total time: ${time}ms\n`);
    process.stdout.moveCursor(0, -dy);
    process.stdout.clearLine(0);
    process.stdout.write(`${name} (${bench.tasks.length}): Complete`);
    process.stdout.moveCursor(0, dy);
    process.stdout.cursorTo(0);
  }

  onTaskStart(task: Task): void {
    const results = this.results;
    if (results.size > 0) {
      process.stdout.moveCursor(0, -(4 + results.size));
    }
    results.set(task.name, this._toResult(task));
    console.table(Array.from(results.values()));
  }

  onTaskComplete(task: Task): void {
    const results = this.results;
    if (results.size > 0) {
      process.stdout.moveCursor(0, -4 - results.size);
    }
    results.set(task.name, this._toResult(task));
    console.table(Array.from(results.values()));
  }

  private _toResult(task: Task): { [key: string]: unknown } {
    const out: { [key: string]: unknown } = {};
    for (const [key, valueFn] of this.columns) {
      out[key] = valueFn(task);
    }
    return out;
  }
}

export class Suite {
  protected benches: Map<string, Bench>;
  protected reporters: Set<SuiteReporter>;
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

  addReporter(reporter: SuiteReporter): this {
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
