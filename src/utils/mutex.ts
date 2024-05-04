import { TimeOutError } from "./timeOutError";

const ATOMICS_TIMED_OUT = "timed-out";
const ERR_MSG_TIMEOUT = "Timed out acquiring mutex";
const ERR_MSG_STATE = "Unexpected mutex state";
const LOCKED = 1;
const UNLOCKED = 0;

export class Mutex {
  private _lock: Int32Array;
  private _hasLock: boolean;

  constructor(sharedBuffer: SharedArrayBuffer, byteOffset = 0) {
    this._hasLock = false;
    this._lock = new Int32Array(sharedBuffer, byteOffset, 1);
  }

  get buffer(): SharedArrayBuffer {
    return this._lock.buffer as SharedArrayBuffer;
  }

  init(): void {
    this._hasLock = false;
    Atomics.store(this._lock, 0, UNLOCKED);
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
      throw new ReferenceError(ERR_MSG_STATE);
    }
    this._hasLock = false;
    Atomics.notify(this._lock, 0, 1);
    return true;
  }
}
