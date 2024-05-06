import { Matching } from "./matching";

export interface MatchRequest<T> {
  matching: Matching<T>;
  mutexBuffer: SharedArrayBuffer;
  stack: {
    mutexBuffer: SharedArrayBuffer;
    sizeBuffer: SharedArrayBuffer;
    valueBuffer: SharedArrayBuffer;
  };
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface MatchResult {}

export interface Runner<T> {
  size: Readonly<number>;
  match: (data: MatchRequest<T>) => Promise<MatchResult<T>>;
}
