import fs from "fs";

import { Task } from "tinybench";

import { BenchReporter } from "./benchReporter";

export interface Result {
  name: string;
  unit: string;
  value: number;
  range: number | string;
  extra: string;
}

export class CIReporter implements BenchReporter {
  protected outputPath: string;
  protected results: Result[];

  constructor(outputPath: string) {
    this.outputPath = outputPath;
    this.results = [];
  }

  onTaskComplete(task: Task): void {
    this.results.push(this._toResult(task));
  }

  onComplete(): void {
    fs.appendFileSync(this.outputPath, JSON.stringify(this.results));
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
