import { Mutex } from "./mutex";

const ERR_MSG_POP =
  "Unexpected update during pop. Check push / pop operations are awaited on and mutex is shared properly";
const ERR_MSG_PUSH =
  "Unexpected update during push. Check push / pop operations are awaited on and mutex is shared properly";

export class SharedStack {
  private _mutex: Mutex;
  private _size: Int32Array;
  private _stack: Int32Array;

  constructor(
    stackBuffer: SharedArrayBuffer,
    sizeBuffer: SharedArrayBuffer,
    mutex: Mutex,
  ) {
    this._mutex = mutex;
    this._size = new Int32Array(sizeBuffer);
    this._stack = new Int32Array(stackBuffer);
  }

  get size(): number {
    return Atomics.load(this._size, 0);
  }

  async pop(): Promise<number | undefined> {
    await this._mutex.lock();
    try {
      const size = Atomics.load(this._size, 0);
      if (size <= 0) {
        return undefined;
      }
      const act = Atomics.compareExchange(this._size, 0, size, size - 1);
      if (size !== act) {
        throw new Error(ERR_MSG_POP);
      }
      return Atomics.load(this._stack, size - 1);
    } finally {
      this._mutex.unlock();
    }
  }

  async push(value: number): Promise<boolean> {
    await this._mutex.lock();
    try {
      const size = Atomics.load(this._size, 0);
      if (size >= this._stack.length) {
        return false;
      }
      const act = Atomics.compareExchange(this._size, 0, size, size + 1);
      if (size !== act) {
        throw new Error(ERR_MSG_PUSH);
      }
      Atomics.store(this._stack, size, value);
      return true;
    } finally {
      this._mutex.unlock();
    }
  }
}
