import { Task } from "tinybench";
import { BenchReporter } from "./benchReporter";

export interface Result {
  name: string;
  unit: string;
  value: number;
}

export class CIReporter implements BenchReporter {
  protected isFirst: boolean;

  constructor() {
    this.isFirst = true;
  }

  onStart(): void {
    this.isFirst = true;
    console.log("[");
  }

  onComplete(): void {
    console.log("]");
  }

  onTaskComplete(task: Task): void {
    const samples = task.result!.samples.length;
    const comma = this.isFirst ? "" : ",";

    this.isFirst = false;
    console.log(
      comma,
      JSON.stringify({
        name: task.name,
        unit: "ms",
        value: task.result!.mean,
        range: task.result!.variance,
        extra: `${samples} sample${samples === 1 ? "" : "s"}`,
      })
    );
  }
}
