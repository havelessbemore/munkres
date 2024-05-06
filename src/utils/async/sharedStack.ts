import { Mutex } from "./mutex";

const ERR_MSG_POP =
  "Unexpected update during pop. Check push / pop operations are awaited on and mutex is shared properly";
const ERR_MSG_PUSH =
  "Unexpected update during push. Check push / pop operations are awaited on and mutex is shared properly";

export class SharedStack {
  private _mutex: Mutex;
  private _size: Int32Array;
  private _values: Int32Array;

  constructor(
    valueBuffer: SharedArrayBuffer,
    sizeBuffer: SharedArrayBuffer,
    mutex: Mutex,
  ) {
    this._mutex = mutex;
    this._size = new Int32Array(sizeBuffer);
    this._values = new Int32Array(valueBuffer);
  }

  get size(): number {
    return Atomics.load(this._size, 0);
  }

  async pop(timeout?: number): Promise<number | undefined> {
    return this._mutex.request(() => {
      const size = Atomics.load(this._size, 0);
      if (size <= 0) {
        return undefined;
      }
      const act = Atomics.compareExchange(this._size, 0, size, size - 1);
      if (size !== act) {
        throw new Error(ERR_MSG_POP);
      }
      return Atomics.load(this._values, size - 1);
    }, timeout);
  }

  async push(value: number, timeout?: number): Promise<boolean> {
    return this._mutex.request(() => {
      const size = Atomics.load(this._size, 0);
      if (size >= this._values.length) {
        return false;
      }
      const act = Atomics.compareExchange(this._size, 0, size, size + 1);
      if (size !== act) {
        throw new Error(ERR_MSG_PUSH);
      }
      Atomics.store(this._values, size, value);
      return true;
    }, timeout);
  }
}
