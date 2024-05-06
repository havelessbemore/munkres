import { TimeOutError } from "./timeOutError";

const ATOMICS_TIMED_OUT = "timed-out";
const ERR_MSG_TIMEOUT = "Timed out acquiring mutex";
// const ERR_MSG_STATE = "Unexpected mutex state";
const LOCKED = 1;
const UNLOCKED = 0;

export class Mutex {
  private _hasLock: boolean;
  private _lock: Int32Array;

  constructor(sharedBuffer: SharedArrayBuffer, byteOffset = 0) {
    this._hasLock = false;
    this._lock = new Int32Array(sharedBuffer, byteOffset, 1);
  }

  async request<T>(
    callbackfn: (err?: Error) => T | Promise<T>,
    timeout?: number,
  ): Promise<T> {
    try {
      if (this._hasLock) {
        throw new Error("ALREADY HAS LOCK WTF THIS SHOULD NOT HAPPEN");
      }
      await this.lock(timeout);
      return await callbackfn();
    } finally {
      this.unlock();
    }
  }

  private async lock(timeout?: number): Promise<void> {
    while (!this.tryLock()) {
      const res = Atomics.waitAsync(this._lock, 0, LOCKED, timeout);
      const value = res.async ? await res.value : res.value;
      if (value === ATOMICS_TIMED_OUT) {
        throw new TimeOutError(ERR_MSG_TIMEOUT, timeout ?? 0);
      }
    }
  }

  private tryLock(): boolean {
    return (this._hasLock ||=
      Atomics.compareExchange(this._lock, 0, UNLOCKED, LOCKED) === UNLOCKED);
  }

  private unlock(): void {
    if (this._hasLock) {
      this._hasLock = false;
      Atomics.store(this._lock, 0, UNLOCKED);
      Atomics.notify(this._lock, 0);
    }
  }

  /*
  get hasLock(): boolean {
    return this._hasLock;
  }

  async lock(timeout?: number): Promise<void> {
    while (!this.tryLock()) {
      const res = Atomics.waitAsync(this._lock, 0, LOCKED, timeout);
      const value = res.async ? await res.value : res.value;
      if (value === ATOMICS_TIMED_OUT) {
        throw new TimeOutError(ERR_MSG_TIMEOUT, timeout ?? 0);
      }
    }
  }

  tryLock(): boolean {
    return (this._hasLock ||=
      Atomics.compareExchange(this._lock, 0, UNLOCKED, LOCKED) === UNLOCKED);
  }

  unlock(): boolean {
    if (!this._hasLock) {
      return false;
    }
    if (Atomics.compareExchange(this._lock, 0, LOCKED, UNLOCKED) !== LOCKED) {
      throw new ReferenceError(ERR_MSG_STATE); // Sanity check
    }
    this._hasLock = false;
    Atomics.notify(this._lock, 0, 1);
    return true;
  }
  */
}
