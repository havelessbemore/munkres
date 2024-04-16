import { Task } from "tinybench";
import { SuiteReporter } from "./suiteReporter";

export class BenchmarkjsReporter implements SuiteReporter {
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
