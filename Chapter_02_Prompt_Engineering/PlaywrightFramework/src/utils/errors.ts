/**
 * Domain-specific error raised by the page objects. It preserves the original
 * Playwright failure as the `cause` so that the Allure report and the console
 * output keep the full diagnostic chain (locator timeout, navigation failure,
 * assertion failure, etc.).
 */
export class LoginPageError extends Error {
  public readonly action: string;
  public override readonly cause: unknown;

  constructor(action: string, cause: unknown) {
    const detail =
      cause instanceof Error ? cause.message : cause === undefined ? '' : String(cause);
    super(`LoginPage.${action} failed${detail ? `: ${detail}` : ''}`);
    this.name = 'LoginPageError';
    this.action = action;
    this.cause = cause;
  }
}
