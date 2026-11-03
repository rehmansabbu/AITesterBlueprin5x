export interface LoginCredentials {
  email: string;
  password: string;
}

/**
 * Negative-path credential sets.
 * Every entry deliberately uses fabricated (never real) data. Assertions on
 * these scenarios are limited to observable application behaviour so that no
 * server-side error text is invented.
 */
export const invalidCredentialSets: LoginCredentials[] = [
  { email: 'invalid.user@example.com', password: 'Invalid@123' },
  { email: 'invalid.user@example.com', password: '' },
  { email: '', password: 'Invalid@123' },
  { email: '', password: '' },
];

/**
 * Malformed email representations used to exercise client-side format
 * validation. These are format probes only and are never expected to
 * authenticate.
 */
export const malformedEmails: string[] = [
  'plainaddress',
  'missing@tld',
  '@no-local-part.com',
  'user@',
];

export const samplePassword = 'Invalid@123';
