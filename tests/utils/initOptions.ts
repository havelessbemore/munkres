import { Options } from "../types/options";

export function initOptions(options?: Options): Options {
  options ??= {};
  options.isBigInt ??= false;
  return options;
}
