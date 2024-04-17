import fs from "fs";

import Bench, { Task } from "tinybench";

import { SuiteReporter } from "./suiteReporter";

export interface Result {
  name: string;
  unit: string;
  value: number;
  range: number | string;
  extra: string;
}

export class CIReporter implements SuiteReporter {
  protected outputPath: string;
  protected results: Result[];

  constructor(outputPath: string) {
    this.outputPath = outputPath;
    this.results = [];
  }

  onSuiteStart(): void {
    this.results = [];
  }

  onSuiteComplete(): void {
    fs.appendFileSync(this.outputPath, JSON.stringify(this.results));
  }

  onBenchWarmup(bench: Bench, name?: string): void {
    name = name ?? "";
    console.log(`Bench '${name}' (${bench.tasks.length}): Warming up...`);
  }

  onTaskStart(task: Task): void {
    console.log(`Task '${task.name}': Running...`);
  }

  onTaskComplete(task: Task): void {
    const res = this._toResult(task);
    this.results.push(res);
    console.log(
      [
        res.name,
        "x",
        `${res.value}${res.unit}`,
        res.range,
        `(${res.extra})`,
      ].join(" ")
    );
  }

  private _toResult(task: Task): Result {
    const res = task.result!;
    const samples = res.samples.length;
    return {
      name: task.name,
      value: res.mean,
      unit: "ms",
      range: `±${res.rme.toFixed(2)}%`,
      extra: `${samples} sample${samples === 1 ? "" : "s"}`,
    };
  }
}
