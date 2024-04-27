import { AsyncResource } from "async_hooks";
import { Callback } from "../types/callback";

export class TaskInfo<T> extends AsyncResource {
  private _callback: Callback<T>;

  constructor(callback: Callback<T>) {
    super(TaskInfo.name);
    this._callback = callback;
  }

  done(err: Error): void;
  done(err: undefined, result: T): void;
  done(err?: Error, result?: T): void {
    this.runInAsyncScope(this._callback, null, err, result);
    this.emitDestroy();
  }
}
