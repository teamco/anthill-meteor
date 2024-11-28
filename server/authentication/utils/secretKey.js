import { generateSecret } from 'speakeasy';

/**
 * Generates a secret key using the speakeasy library.
 *
 * The generated secret will be 20 characters long, and will be suitable for use as a
 * secret key in a Two Factor Authentication application.
 *
 * @returns {import("speakeasy").GeneratedSecret} The generated secret key.
 */
export function generateSecretKey() {
  // Generate a secret key
  const secretKey = generateSecret({ length: 20 });

  return secretKey;
}

const secretKey = generateSecretKey();
console.log(secretKey);
