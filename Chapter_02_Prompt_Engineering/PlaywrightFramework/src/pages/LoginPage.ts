import { Locator, Page } from '@playwright/test';
import { LoginPageError } from '../utils/errors';
import { logger } from '../utils/logger';

/**
 * Authentication error text rendered by the application for every rejected
 * credential combination (invalid, empty or malformed). Captured from the live
 * VWO login page, not invented.
 */
export const VERIFIED_AUTHENTICATION_ERROR =
  'Your email, password, IP address or location did not match';

/** HTTP status returned by the login endpoint for rejected credentials. */
export const HTTP_UNAUTHORIZED = 401;

/** HTTP status returned by the login endpoint when it rate-limits the client. */
export const HTTP_TOO_MANY_REQUESTS = 429;

/**
 * Page Object for the VWO Login Dashboard login view.
 *
 * Locator strategy (in priority order as required):
 *  1. getByRole()        - Sign in, Forgot Password, Back, links, SSO/Google buttons.
 *  2. XPath by stable id - the email/password/checkbox inputs, which appear on
 *                          several hidden views at once and therefore have no
 *                          unique accessible role/placeholder.
 *
 * The page keeps the login, forgot-password, reset-password and SSO views in
 * the DOM simultaneously (ng-show/ng-hide), so role/placeholder-only locators
 * are ambiguous. Every locator below was verified to resolve to exactly one
 * element against the live application.
 */
export class LoginPage {
  readonly page: Page;

  readonly loginForm: Locator;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly rememberMeInput: Locator;
  readonly rememberMeLabel: Locator;
  readonly signInButton: Locator;
  readonly forgotPasswordButton: Locator;
  readonly passwordVisibilityToggle: Locator;
  readonly notificationBox: Locator;
  readonly notificationMessage: Locator;
  readonly brandLogo: Locator;
  readonly freeTrialLink: Locator;
  readonly privacyPolicyLink: Locator;
  readonly termsLink: Locator;
  readonly googleSignInButton: Locator;
  readonly ssoSignInButton: Locator;
  readonly forgotPasswordEmailInput: Locator;
  readonly backToLoginButton: Locator;

  constructor(page: Page) {
    this.page = page;

    this.loginForm = page.locator('//form[@id="js-login-form"]');

    // Primary credential fields (XPath by stable id - see class comment).
    this.emailInput = page.locator('//input[@id="login-username"]');
    this.passwordInput = page.locator('//input[@id="login-password"]');

    // "Remember me" is a hidden native checkbox driven by a visible label.
    this.rememberMeInput = page.locator('//input[@id="checkbox-remember"]');
    this.rememberMeLabel = page.locator('//label[@for="checkbox-remember"]');

    // Accessible-first locators for controls that have a unique accessible name.
    this.signInButton = page.getByRole('button', { name: 'Sign in', exact: true });
    this.forgotPasswordButton = page.getByRole('button', { name: 'Forgot Password?', exact: true });
    this.passwordVisibilityToggle = this.loginForm.getByRole('button', {
      name: 'Toggle password visibility',
    });

    this.notificationBox = page.locator('//div[@id="js-notification-box"]');
    this.notificationMessage = page.locator('//div[@id="js-notification-box-msg"]');

    this.brandLogo = page.locator('//img[@id="vow-login-logo"]');
    // The free-trial link's accessible name is populated asynchronously by the
    // application's translation layer, so a role+name locator is intermittent.
    // The stable target URL is used instead (XPath fallback).
    this.freeTrialLink = page.locator('//a[contains(@href, "vwo.com/free-trial")]');
    this.privacyPolicyLink = page.getByRole('link', { name: 'Privacy policy', exact: true });
    this.termsLink = page.getByRole('link', { name: 'Terms', exact: true });
    this.googleSignInButton = page.getByRole('button', { name: 'Sign in with Google', exact: true });
    this.ssoSignInButton = page.getByRole('button', { name: 'Sign in using SSO', exact: true });

    // Forgot-password view.
    this.forgotPasswordEmailInput = page.locator('//input[@id="forgot-password-username"]');
    this.backToLoginButton = page.getByRole('button', { name: 'Back', exact: false }).first();
  }

  /**
   * Wraps an interaction so any Playwright failure surfaces as a typed,
   * contextual error while keeping the original failure as the cause.
   */
  private async attempt<T>(action: string, operation: () => Promise<T>): Promise<T> {
    try {
      return await operation();
    } catch (error) {
      logger.error(`LoginPage.${action} failed: ${error instanceof Error ? error.message : error}`);
      throw new LoginPageError(action, error);
    }
  }

  async navigate(url: string): Promise<void> {
    await this.attempt('navigate', async () => {
      await this.page.goto(url, { waitUntil: 'domcontentloaded' });
      await this.waitForLoginView();
    });
  }

  /** Waits for the login view to be ready (auto-waiting, no fixed sleeps). */
  async waitForLoginView(): Promise<void> {
    await this.attempt('waitForLoginView', async () => {
      await this.emailInput.waitFor({ state: 'visible' });
      await this.signInButton.waitFor({ state: 'visible' });
    });
  }

  async enterEmail(email: string): Promise<void> {
    await this.attempt('enterEmail', async () => {
      await this.emailInput.fill(email);
    });
  }

  async clearEmail(): Promise<void> {
    await this.attempt('clearEmail', async () => {
      await this.emailInput.clear();
    });
  }

  async enterPassword(password: string): Promise<void> {
    await this.attempt('enterPassword', async () => {
      await this.passwordInput.fill(password);
    });
  }

  async clearPassword(): Promise<void> {
    await this.attempt('clearPassword', async () => {
      await this.passwordInput.clear();
    });
  }

  async getEmailValue(): Promise<string> {
    return this.attempt('getEmailValue', () => this.emailInput.inputValue());
  }

  async getPasswordValue(): Promise<string> {
    return this.attempt('getPasswordValue', () => this.passwordInput.inputValue());
  }

  /** Sets the "Remember me" checkbox to the desired state via its label. */
  async setRememberMe(checked: boolean): Promise<void> {
    await this.attempt('setRememberMe', async () => {
      if ((await this.rememberMeInput.isChecked()) !== checked) {
        await this.rememberMeLabel.click();
      }
    });
  }

  async isRememberMeChecked(): Promise<boolean> {
    return this.attempt('isRememberMeChecked', () => this.rememberMeInput.isChecked());
  }

  async clickSignIn(): Promise<void> {
    await this.attempt('clickSignIn', async () => {
      await this.signInButton.click();
    });
  }

  /**
   * Clicks "Sign in" and resolves with the HTTP status returned by the login
   * endpoint (`POST /login`). This lets tests distinguish an authentication
   * rejection (401) from a rate-limited response (429) deterministically.
   */
  async submitLogin(): Promise<number> {
    return this.attempt('submitLogin', async () => {
      const [response] = await Promise.all([
        this.page.waitForResponse(
          (candidate) =>
            new URL(candidate.url()).pathname === '/login' &&
            candidate.request().method() === 'POST',
          { timeout: 30000 },
        ),
        this.signInButton.click(),
      ]);
      return response.status();
    });
  }

  /**
   * Fills the credentials and submits the form, returning the login endpoint
   * status. Empty strings intentionally leave the corresponding field blank so
   * that empty-field scenarios are exercised.
   */
  async login(email: string, password: string, rememberMe = false): Promise<number> {
    if (email.length > 0) {
      await this.enterEmail(email);
    }
    if (password.length > 0) {
      await this.enterPassword(password);
    }
    await this.setRememberMe(rememberMe);
    return this.submitLogin();
  }

  /** Waits for the authentication error notification to become visible. */
  async waitForNotification(): Promise<void> {
    await this.attempt('waitForNotification', async () => {
      await this.notificationBox.waitFor({ state: 'visible' });
    });
  }

  async isNotificationVisible(): Promise<boolean> {
    return this.attempt('isNotificationVisible', () => this.notificationBox.isVisible());
  }

  async getNotificationText(): Promise<string> {
    return this.attempt('getNotificationText', () =>
      this.notificationMessage.innerText().then((text) => text.trim()),
    );
  }

  async getPasswordFieldType(): Promise<string | null> {
    return this.attempt('getPasswordFieldType', () => this.passwordInput.getAttribute('type'));
  }

  async isPasswordMasked(): Promise<boolean> {
    return this.attempt('isPasswordMasked', async () => (await this.getPasswordFieldType()) === 'password');
  }

  async togglePasswordVisibility(): Promise<void> {
    await this.attempt('togglePasswordVisibility', async () => {
      await this.passwordVisibilityToggle.click();
    });
  }

  async clickForgotPassword(): Promise<void> {
    await this.attempt('clickForgotPassword', async () => {
      await this.forgotPasswordButton.click();
      await this.forgotPasswordEmailInput.waitFor({ state: 'visible' });
    });
  }

  async goBackToLogin(): Promise<void> {
    await this.attempt('goBackToLogin', async () => {
      await this.backToLoginButton.click();
      await this.waitForLoginView();
    });
  }

  async isLoginViewVisible(): Promise<boolean> {
    return this.attempt('isLoginViewVisible', () => this.emailInput.isVisible());
  }

  async isForgotPasswordViewVisible(): Promise<boolean> {
    return this.attempt('isForgotPasswordViewVisible', () => this.forgotPasswordEmailInput.isVisible());
  }

  currentUrl(): string {
    return this.page.url();
  }

  async title(): Promise<string> {
    return this.attempt('title', () => this.page.title());
  }
}
