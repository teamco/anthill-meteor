/**
 * Generates a unique hexadecimal ID string using MongoDB's ObjectId
 * @returns {string} A hexadecimal string representation of an ObjectId
 */
export const generateId = (
  m = Math,
  d = Date,
  h = 16,
  s = (s: number) => m.floor(s).toString(h),
): string =>
  s(d.now() / 1000) + ' '.repeat(h).replace(/./g, () => s(m.random() * h));
