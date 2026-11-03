import * as path from 'path';
import * as dotenv from 'dotenv';

dotenv.config({ path: path.resolve(process.cwd(), '.env'), quiet: true });

function readString(key: string, fallback: string): string {
  const value = process.env[key];
  return value === undefined ? fallback : value.trim();
}

function readNumber(key: string, fallback: number): number {
  const raw = process.env[key];
  if (raw === undefined || raw.trim() === '') {
    return fallback;
  }
  const parsed = Number(raw);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function readBoolean(key: string, fallback: boolean): boolean {
  const raw = process.env[key];
  if (raw === undefined || raw.trim() === '') {
    return fallback;
  }
  return raw.trim().toLowerCase() === 'true';
}

export const env = {
  baseUrl: readString('BASE_URL', 'https://app.wingify.com/#/login'),
  validEmail: readString('VALID_EMAIL', ''),
  validPassword: readString('VALID_PASSWORD', ''),
  headless: readBoolean('HEADLESS', false),
  defaultTimeout: readNumber('DEFAULT_TIMEOUT', 30000),
  expectTimeout: readNumber('EXPECT_TIMEOUT', 15000),
  navigationTimeout: readNumber('NAVIGATION_TIMEOUT', 60000),
} as const;

export function hasValidCredentials(): boolean {
  return env.validEmail.length > 0 && env.validPassword.length > 0;
}
