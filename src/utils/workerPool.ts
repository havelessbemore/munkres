import { EventEmitter } from "node:events";
import { Worker } from "node:worker_threads";

import { ARRAY_MAX_LENGTH } from "./constants";
import { Callback } from "../types/callback";
import { TaskInfo } from "./taskInfo";

const kTaskInfo = Symbol("kTaskInfo");

export class PoolWorker<R> extends Worker {
  [kTaskInfo]?: TaskInfo<R>;
}

export class WorkerPool<T, R> extends EventEmitter {
  private _free: PoolWorker<R>[];
  private _path: string;
  private _size: number;
  private _tasks: { task: T; callback: Callback<R> }[];
  private _workers: PoolWorker<R>[];

  constructor(path: string, size: number) {
    super();
    this._free = [];
    this._path = path;
    this._size = size;
    this._tasks = [];
    this._workers = [];
  }

  get size(): number {
    return this._size;
  }

  set size(size: number) {
    this._size = Math.max(0, Math.min(ARRAY_MAX_LENGTH, size));
  }

  close(): void {
    for (const worker of this._workers) {
      worker.terminate();
    }
  }

  run(task: T, callback: Callback<R>): void {
    if (this._workers.length < this._size) {
      this._addWorker();
    }
    if (this._free.length > 0) {
      this._run(task, callback);
    } else {
      this._tasks.push({ task, callback });
    }
  }

  private _addWorker(): void {
    const worker = this._createWorker();
    this._free.push(worker);
    this._workers.push(worker);
    this._tryRun();
  }

  private _createWorker(): PoolWorker<R> {
    const worker = new PoolWorker<R>(this._path);

    worker.on("message", (result: R) => {
      worker[kTaskInfo]?.done(undefined, result);
      worker[kTaskInfo] = undefined;
      this._free.push(worker);
      this._tryRun();
    });

    worker.on("error", (err: Error) => {
      if (worker[kTaskInfo]) {
        worker[kTaskInfo].done(err);
      } else {
        this.emit("error", err);
      }
      this._workers.splice(this._workers.indexOf(worker), 1);
      this._addWorker();
    });

    return worker;
  }

  private _run(task: T, callback: Callback<R>): void {
    const worker = this._free.pop()!;
    worker[kTaskInfo] = new TaskInfo(callback);
    worker.postMessage(task);
  }

  private _tryRun(): void {
    if (this._tasks.length > 0) {
      const { task, callback } = this._tasks.shift()!;
      this._run(task, callback);
    }
  }
}
