import Bench, { Task } from "tinybench";
import { BenchReporter } from "./benchReporter";

export class TerminalReporter implements BenchReporter {
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
