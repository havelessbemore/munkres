import Bench, { Task } from "tinybench";

export interface SuiteConfig {
  warmup?: boolean;
}

export class Suite {
  protected benches: Map<string, Bench>;
  protected columns: [string, (task: Task) => unknown][];
  protected warmup: boolean;

  constructor(config: SuiteConfig = {}) {
    this.benches = new Map();
    this.columns = [
      ["Name", task => task.name],
      ["Min (ms)", task => task.result?.min ?? ""],
      ["Max (ms)", task => task.result?.max ?? ""],
      ["Avg (ms)", task => task.result?.mean ?? ""],
      ["Samples", task => task.result?.samples?.length ?? ""],
    ];
    this.warmup = config.warmup === true;
  }

  add(name: string, bench: Bench): this {
    this.benches.set(name, bench);
    return this;
  }

  async run(): Promise<Bench[]> {
    for (const [name, bench] of this.benches) {
      this.setupBench(name, bench);
      if (this.warmup) {
        await bench.warmup();
      }
      await bench.run();
      process.stdout.write(`\n`);
    }
    return Array.from(this.benches.values());
  }

  private toResult(task: Task): { [key: string]: unknown } {
    const out: { [key: string]: unknown } = {};
    for (const [key, valueFn] of this.columns) {
      out[key] = valueFn(task);
    }
    return out;
  }

  private setupBench(name: string, bench: Bench): void {
    const results: Map<string, { [key: string]: unknown }> = new Map();

    bench.addEventListener("warmup", () => {
      process.stdout.write(`${name} (${bench.tasks.length}): Warming up...`);
    });

    bench.addEventListener("start", () => {
      process.stdout.clearLine(0);
      process.stdout.cursorTo(0);
      process.stdout.write(`${name} (${bench.tasks.length}): Running...\n`);
    });

    bench.addEventListener("complete", () => {
      const time = bench.tasks.reduce((sum, t) => sum + t.result!.totalTime, 0);
      const dy = 6 + results.size;
      process.stdout.write(`Total time: ${time}ms\n`);
      process.stdout.moveCursor(0, -dy);
      process.stdout.clearLine(0);
      process.stdout.write(`${name} (${bench.tasks.length}): Complete`);
      process.stdout.moveCursor(0, dy);
      process.stdout.cursorTo(0);
    });

    for (const task of bench.tasks) {
      task.addEventListener("start", () => {
        if (results.size > 0) {
          process.stdout.moveCursor(0, -(4 + results.size));
        }
        results.set(task.name, this.toResult(task));
        console.table(Array.from(results.values()));
      });
      task.addEventListener("complete", () => {
        if (results.size > 0) {
          process.stdout.moveCursor(0, -4 - results.size);
        }
        results.set(task.name, this.toResult(task));
        console.table(Array.from(results.values()));
      });
    }
  }
}
