import { Matching } from "./matching";

export interface MatchRequest<T> {
  indexBuffer: SharedArrayBuffer;
  matching: Matching<T>;
  mutexBuffer: SharedArrayBuffer;
  sizeBuffer: SharedArrayBuffer;
}

export interface MatchResult {}

export interface Runner<T> {
  size: Readonly<number>;
  match: (data: MatchRequest<T>) => Promise<MatchResult<T>>;
}
