import { test, expect } from '../src/fixtures/test.fixtures';
import * as allure from 'allure-js-commons';
import { Severity } from 'allure-js-commons';
import { env, hasValidCredentials } from '../src/config/env';

/**
 * Positive and UI scenarios for the VWO Login Dashboard login view.
 *
 * Every assertion below is traceable to verified behaviour of the live
 * application at https://app.wingify.com/#/login. Scenarios that the
 * application does not currently implement are explicitly skipped with the
 * observed reason instead of asserting invented behaviour.
 */
test.describe('VWO Login Dashboard - Login page (positive & UI)', () => {
  test.beforeEach(async ({ loginPage }) => {
    await allure.epic('VWO Login Dashboard');
    await allure.feature('Login');
    await allure.story('Positive & UI');
    await allure.owner('QA Automation');
    await loginPage.navigate(env.baseUrl);
  });

  test('Verify login page navigation to the VWO login URL', async ({ loginPage, page }) => {
    await allure.severity(Severity.CRITICAL);

    await test.step('Assert the login URL is loaded', async () => {
      await expect(page).toHaveURL(/#\/login/);
      await expect(page).toHaveURL(/app\.wingify\.com/);
    });

    await test.step('Assert HTTPS is enforced', async () => {
      expect(new URL(page.url()).protocol).toBe('https:');
    });

    await test.step('Assert the login view is rendered', async () => {
      await expect(loginPage.emailInput).toBeVisible();
      await expect(loginPage.signInButton).toBeVisible();
      await expect(page).toHaveTitle(/login/i);
    });
  });

  test('Verify login page key elements are visible', async ({ loginPage }) => {
    await allure.severity(Severity.CRITICAL);

    await test.step('Assert brand and primary controls are visible', async () => {
      await expect(loginPage.brandLogo).toBeVisible();
      await expect(loginPage.emailInput).toBeVisible();
      await expect(loginPage.passwordInput).toBeVisible();
      await expect(loginPage.rememberMeLabel).toBeVisible();
      await expect(loginPage.signInButton).toBeVisible();
    });

    await test.step('Assert secondary navigation is visible', async () => {
      await expect(loginPage.forgotPasswordButton).toBeVisible();
      await expect(loginPage.freeTrialLink).toBeVisible();
      await expect(loginPage.googleSignInButton).toBeVisible();
      await expect(loginPage.ssoSignInButton).toBeVisible();
    });
  });

  test('Verify email field functionality', async ({ loginPage }) => {
    await allure.severity(Severity.NORMAL);

    await test.step('Assert the email field accepts typed input', async () => {
      await loginPage.enterEmail('someone@example.com');
      await expect(loginPage.emailInput).toHaveValue('someone@example.com');
      await expect(loginPage.emailInput).toHaveAttribute('type', 'email');
    });

    await test.step('Assert the email field can be cleared', async () => {
      await loginPage.clearEmail();
      await expect(loginPage.emailInput).toHaveValue('');
    });
  });

  test('Verify password field functionality and masking', async ({ loginPage }) => {
    await allure.severity(Severity.CRITICAL);

    await test.step('Assert the password field accepts input', async () => {
      await loginPage.enterPassword('Invalid@123');
      await expect(loginPage.passwordInput).toHaveValue('Invalid@123');
    });

    await test.step('Assert the password value is masked', async () => {
      await expect(loginPage.passwordInput).toHaveAttribute('type', 'password');
      expect(await loginPage.isPasswordMasked()).toBe(true);
    });
  });

  test('Verify password visibility toggle', async ({ loginPage }) => {
    await allure.severity(Severity.NORMAL);

    await test.step('Assert masking is enabled by default', async () => {
      await expect(loginPage.passwordInput).toHaveAttribute('type', 'password');
    });

    await test.step('Assert the toggle reveals the password', async () => {
      await loginPage.enterPassword('Invalid@123');
      await loginPage.togglePasswordVisibility();
      await expect(loginPage.passwordInput).toHaveAttribute('type', 'text');
    });

    await test.step('Assert the toggle re-masks the password', async () => {
      await loginPage.togglePasswordVisibility();
      await expect(loginPage.passwordInput).toHaveAttribute('type', 'password');
    });
  });

  test('Verify Remember Me checkbox selection behaviour', async ({ loginPage }) => {
    await allure.severity(Severity.NORMAL);

    await test.step('Assert Remember Me is unchecked by default', async () => {
      await expect(loginPage.rememberMeInput).not.toBeChecked();
    });

    await test.step('Assert Remember Me can be selected', async () => {
      await loginPage.setRememberMe(true);
      await expect(loginPage.rememberMeInput).toBeChecked();
    });

    await test.step('Assert Remember Me can be cleared again', async () => {
      await loginPage.setRememberMe(false);
      await expect(loginPage.rememberMeInput).not.toBeChecked();
    });
  });

  test('Verify keyboard navigation between fields', async ({ loginPage, page }) => {
    await allure.severity(Severity.MINOR);

    await test.step('Assert Tab moves focus from email to password', async () => {
      await loginPage.emailInput.click();
      await page.keyboard.press('Tab');
      await expect(loginPage.passwordInput).toBeFocused();
    });
  });

  test('Verify Forgot Password navigation', async ({ loginPage, page }) => {
    await allure.severity(Severity.NORMAL);

    await test.step('Assert navigation to the forgot password view', async () => {
      await loginPage.clickForgotPassword();
      await expect(page).toHaveURL(/#\/forgot-password/);
      await expect(loginPage.forgotPasswordEmailInput).toBeVisible();
      await expect(loginPage.emailInput).toBeHidden();
    });

    await test.step('Assert navigation back to the login view', async () => {
      await loginPage.goBackToLogin();
      await expect(page).toHaveURL(/#\/login/);
      await expect(loginPage.emailInput).toBeVisible();
    });
  });

  test('Verify Free Trial registration navigation', async ({ loginPage }) => {
    await allure.severity(Severity.MINOR);

    await test.step('Assert the free trial link points to the registration page', async () => {
      await expect(loginPage.freeTrialLink).toBeVisible();
      await expect(loginPage.freeTrialLink).toHaveAttribute('href', /free-trial/);
      await expect(loginPage.freeTrialLink).toHaveAttribute('target', '_blank');
    });
  });

  test('Verify field validation on blur (verified behaviour: none)', async ({ loginPage }) => {
    await allure.severity(Severity.MINOR);

    await test.step('Enter a malformed email and move focus away', async () => {
      await loginPage.enterEmail('plainaddress');
      await loginPage.passwordInput.click();
    });

    await test.step('Assert no validation is triggered on blur', async () => {
      // Verified: the form uses novalidate and renders no inline/blur validation.
      await expect(loginPage.notificationBox).toBeHidden();
      await expect(loginPage.emailInput).toHaveValue('plainaddress');
    });
  });

  test('Verify successful login and redirection to the authenticated dashboard', async ({
    loginPage,
    page,
  }) => {
    test.skip(
      !hasValidCredentials(),
      'Requires verified test credentials. Set VALID_EMAIL and VALID_PASSWORD in .env; credentials are never invented.',
    );

    await allure.severity(Severity.BLOCKER);

    await test.step('Submit valid credentials with Remember Me enabled', async () => {
      await loginPage.login(env.validEmail, env.validPassword, true);
    });

    await test.step('Assert redirection away from the login page', async () => {
      await expect(page).not.toHaveURL(/#\/login/);
      await expect(loginPage.emailInput).toBeHidden();
    });
  });

  test('Verify responsive login page (verified behaviour: viewport pinned)', async ({ loginPage }) => {
    test.skip(
      true,
      'The application pins the viewport to width=1280 via its meta viewport tag, so the login form is not rendered as a mobile-responsive layout. Verified against the live application.',
    );

    await loginPage.waitForLoginView();
  });

  test('Verify Light/Dark mode options (verified behaviour: not available)', async ({ loginPage }) => {
    test.skip(
      true,
      'No theme (light/dark) toggle is present in the live VWO login page. Verified against the live application.',
    );

    await loginPage.waitForLoginView();
  });

  test('Verify loading state during authentication (verified behaviour: not observable)', async ({
    loginPage,
  }) => {
    test.skip(
      true,
      'The Sign in button is never disabled and no deterministic loading indicator is exposed during authentication; a loading state cannot be asserted reliably. Verified against the live application.',
    );

    await loginPage.waitForLoginView();
  });
});
