import { Matching } from "./matching";

export interface MatchRequest<T> {
  id: number;
  y: number;
  matching: Matching<T>;
  slack: Uint32Array;
  slackY: Uint32Array;
}

export interface MatchResult<T> {
  id: number;
  y: number;
  N: number;
  slackV: MutableArrayLike<T>;
}

export interface Runner<T> {
  size: Readonly<number>;
  match: (data: MatchRequest<T>) => Promise<MatchResult<T>>;
}
