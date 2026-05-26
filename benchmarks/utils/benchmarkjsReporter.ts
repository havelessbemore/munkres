import { type Task } from "tinybench";

import type { SuiteReporter } from "../types/suiteReporter.ts";

export class BenchmarkjsReporter implements SuiteReporter {
  onTaskComplete(task: Task): void {
    const res = task.result;
    if (
      !res ||
      (res.state !== "completed" && res.state !== "aborted-with-statistics")
    ) {
      return;
    }
    // tinybench 6 moves stats onto latency/throughput sub-objects. `hz` is
    // ops/sec, equivalent to throughput.mean. `rme` (relative margin of
    // error) lives on latency.
    const runs = res.latency.samplesCount;
    const sb: string[] = [];
    sb.push(`${task.name} x`);
    sb.push(`${this._formatNumber(res.throughput.mean)} ops/sec`);
    sb.push(`±${res.latency.rme.toFixed(2)}%`);
    sb.push(`(${runs} run${runs === 1 ? "" : "s"} sampled)`);
    console.log(sb.join(" "));
  }

  protected _formatNumber(v: number): string {
    const parts = v.toFixed(v < 100 ? 2 : 0).split(".");
    parts[0] = parts[0].replace(/(?=(?:\d{3})+$)(?!\b)/g, ",");
    return parts.join(".");
  }
}
