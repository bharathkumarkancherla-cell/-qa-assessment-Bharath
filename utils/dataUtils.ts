/**
 * Generates a random alphanumeric string of given length.
 * @param length - Number of characters to generate (default: 8)
 * @returns A random alphanumeric string
 */
export function getDummyString(length: number = 8): string {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';

  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  return result;
}
