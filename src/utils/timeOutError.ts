export class TimeOutError extends Error {
  /**
   * Duration in milliseconds after which the timeout error was thrown
   */
  public duration: number;

  constructor(message: string, duration: number) {
    super(message);
    this.duration = duration;
    this.name = TimeOutError.name;

    // Maintaining proper stack trace for where
    // error was thrown (only supported in V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, TimeOutError);
    }
  }
}
