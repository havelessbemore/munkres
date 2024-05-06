import { Matching } from "./matching";

export interface MatchRequest<T> {
  id: number;
  matching: Matching<T>;
  mutexBuffer: SharedArrayBuffer;
  stackMutexBuffer: SharedArrayBuffer;
  stackSizeBuffer: SharedArrayBuffer;
  stackValueBuffer: SharedArrayBuffer;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface MatchResult {}

export interface Runner<T> {
  size: Readonly<number>;
  match: (data: MatchRequest<T>) => Promise<MatchResult<T>>;
}
