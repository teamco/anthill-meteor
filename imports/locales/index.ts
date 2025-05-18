import * as enUs from './en-US';

enum ELocale {
  enUS = 'en-US',
}

/**
 * @export
 * @type {Object}
 */
export const localeData: Record<string, { [key: string]: string }> = {
  [ELocale.enUS]: enUs.default,
};
