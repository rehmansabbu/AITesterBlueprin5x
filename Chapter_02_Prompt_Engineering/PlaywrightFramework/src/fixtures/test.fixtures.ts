import { test as base, expect } from '@playwright/test';
import * as allure from 'allure-js-commons';
import { ContentType } from 'allure-js-commons';
import { LoginPage } from '../pages/LoginPage';

export type LoginFixtures = {
  loginPage: LoginPage;
  diagnostics: void;
};

/**
 * Extended Playwright test object.
 *
 *  - `loginPage`     : the LoginPage page object under test.
 *  - `diagnostics`   : auto fixture that collects browser console output and, on
 *                      failure, attaches a full-page screenshot plus the console
 *                      log to both the Playwright and Allure reports.
 */
export const test = base.extend<LoginFixtures>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },

  diagnostics: [
    async ({ page }, use, testInfo) => {
      const logs: string[] = [];
      page.on('console', (message) => logs.push(`[console.${message.type()}] ${message.text()}`));
      page.on('pageerror', (error) => logs.push(`[pageerror] ${error.message}`));

      await use();

      const hasFailed = testInfo.status !== testInfo.expectedStatus;

      if (logs.length > 0) {
        const body = logs.join('\n');
        await testInfo.attach('console-log', { body, contentType: 'text/plain' });
        if (hasFailed) {
          await allure.attachment('Console Log', body, ContentType.TEXT);
        }
      }

      if (hasFailed) {
        const screenshot = await page.screenshot({ fullPage: true }).catch(() => undefined);
        if (screenshot) {
          await testInfo.attach('failure-screenshot', { body: screenshot, contentType: 'image/png' });
          await allure.attachment('Failure Screenshot', screenshot, ContentType.PNG);
        }
      }
    },
    { auto: true },
  ],
});

export { expect };
