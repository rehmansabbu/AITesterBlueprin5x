import { test, expect } from '../src/fixtures/test.fixtures';
import * as allure from 'allure-js-commons';
import { ContentType, Severity } from 'allure-js-commons';
import { env } from '../src/config/env';
import { invalidCredentialSets, malformedEmails, samplePassword } from '../src/data/loginData';
import {
  HTTP_TOO_MANY_REQUESTS,
  HTTP_UNAUTHORIZED,
  LoginPage,
  VERIFIED_AUTHENTICATION_ERROR,
} from '../src/pages/LoginPage';

/**
 * Asserts that the application rejected an authentication attempt.
 *
 * The live VWO login endpoint returns 401 for rejected credentials and the
 * application renders the verified error notification. After repeated failed
 * attempts it returns 429 and honours the rate-limiting requirement without
 * rendering the credential error. Both outcomes deny authentication, so the
 * status is asserted explicitly instead of being treated as a failure.
 */
async function expectAuthenticationRejected(loginPage: LoginPage, status: number): Promise<void> {
  expect([HTTP_UNAUTHORIZED, HTTP_TOO_MANY_REQUESTS]).toContain(status);

  if (status === HTTP_UNAUTHORIZED) {
    await loginPage.waitForNotification();
    await expect(loginPage.notificationBox).toBeVisible();
    expect(await loginPage.getNotificationText()).toContain(VERIFIED_AUTHENTICATION_ERROR);
    return;
  }

  await allure.attachment(
    'Rate limit encountered (HTTP 429)',
    'The login endpoint is rate-limiting this client, so the credential error notification is not rendered. Authentication is still denied.',
    ContentType.TEXT,
  );
}

/**
 * Negative scenarios for the VWO Login Dashboard login view.
 *
 * No server-side error text is invented: the asserted message was captured
 * from the live application, and the rate-limit path is verified behaviour.
 */
test.describe('VWO Login Dashboard - Login page (negative)', () => {
  test.beforeEach(async ({ loginPage }) => {
    await allure.epic('VWO Login Dashboard');
    await allure.feature('Login');
    await allure.story('Negative');
    await allure.owner('QA Automation');
    await loginPage.navigate(env.baseUrl);
  });

  for (const { email, password } of invalidCredentialSets) {
    const scenario = `email=${email === '' ? '<empty>' : `"${email}"`}, password=${
      password === '' ? '<empty>' : '<provided>'
    }`;

    test(`Verify login is rejected for invalid credentials (${scenario})`, async ({
      loginPage,
      page,
    }) => {
      await allure.severity(Severity.CRITICAL);

      let status = 0;
      await test.step('Submit the invalid credential combination', async () => {
        status = await loginPage.login(email, password, false);
      });

      await test.step('Assert the authentication attempt is rejected', async () => {
        await expectAuthenticationRejected(loginPage, status);
      });

      await test.step('Assert dashboard access is denied', async () => {
        expect(page.url()).not.toContain('dashboard');
        await expect(loginPage.emailInput).toBeVisible();
        expect(await loginPage.isLoginViewVisible()).toBe(true);
      });
    });
  }

  for (const email of malformedEmails) {
    test(`Verify login is rejected for a malformed email ("${email}")`, async ({ loginPage }) => {
      await allure.severity(Severity.MINOR);

      let status = 0;
      await test.step('Submit a malformed email with a password', async () => {
        status = await loginPage.login(email, samplePassword, false);
      });

      await test.step('Assert the authentication attempt is rejected', async () => {
        await expectAuthenticationRejected(loginPage, status);
      });
    });
  }

  test('Verify the authentication error message for rejected credentials', async ({ loginPage }) => {
    await allure.severity(Severity.NORMAL);

    const status = await loginPage.login('invalid.user@example.com', samplePassword, false);

    test.skip(
      status === HTTP_TOO_MANY_REQUESTS,
      'The login endpoint is rate-limiting this client (HTTP 429); the credential error message cannot be observed until the limit resets.',
    );

    expect(status).toBe(HTTP_UNAUTHORIZED);
    await loginPage.waitForNotification();
    await expect(loginPage.notificationBox).toBeVisible();
    expect(await loginPage.getNotificationText()).toContain(VERIFIED_AUTHENTICATION_ERROR);
  });

  test('Verify password masking on the login form', async ({ loginPage }) => {
    await allure.severity(Severity.NORMAL);

    await test.step('Enter a password and assert it is masked', async () => {
      await loginPage.enterPassword(samplePassword);
      await expect(loginPage.passwordInput).toHaveAttribute('type', 'password');
      expect(await loginPage.getPasswordFieldType()).toBe('password');
    });

    await test.step('Assert the masked value is stored but not exposed as text', async () => {
      expect(await loginPage.getPasswordValue()).toBe(samplePassword);
      await expect(loginPage.passwordInput).not.toHaveAttribute('type', 'text');
    });
  });

  test('Verify unsuccessful authentication does not provide dashboard access', async ({
    loginPage,
    page,
  }) => {
    await allure.severity(Severity.CRITICAL);

    let status = 0;
    await test.step('Submit invalid credentials', async () => {
      status = await loginPage.login('invalid.user@example.com', samplePassword, false);
    });

    await test.step('Assert the authentication attempt is rejected', async () => {
      await expectAuthenticationRejected(loginPage, status);
    });

    await test.step('Assert the user remains on the login page', async () => {
      await expect(page).toHaveURL(/#\/login/);
      expect(page.url()).not.toContain('dashboard');
      expect(await loginPage.isLoginViewVisible()).toBe(true);
    });
  });
});
