import React from 'react';
import { MessageFormatElement } from 'react-intl';

import { EConsoleType, logger } from './console.util';
import { uniqueId } from 'lodash';

export type TIntl = {
  messages: Record<string, string> | Record<string, MessageFormatElement[]>;
  formatMessage: (
    { id, defaultMessage }: { id: string; defaultMessage: string },
    object: { [key: string]: string | ((chunks: string[]) => React.ReactNode) },
  ) => string | React.ReactNode;
};

export type TParams = {
  [key: string]: string | ((chunks: string[]) => React.ReactNode);
};

/**
 * Translate a given message id to its translated string.
 * If the id is not found, log an error and return the id as the default message.
 * @param {Object} intl - an object containing the translation messages and a formatMessage method.
 * @param {string} id - the id of the message to translate.
 * @param {Object} [params={}] - an object of parameters to pass to the formatMessage method.
 * @returns {string} - the translated string.
 */
export const t = (
  intl: TIntl,
  id: string,
  params: Record<string, any> = {},
): string | React.ReactNode => {
  // Filter out undefined and direct ReactNode values
  const filteredParams: TParams = Object.keys(params).reduce((acc, key) => {
    const value = params[key];
    if (typeof value === 'string' || typeof value === 'function') {
      acc[key] = value;
    }
    return acc;
  }, {} as TParams);

  try {
    return intl?.formatMessage({ id, defaultMessage: id }, filteredParams);
  } catch (e) {
    if (e instanceof Error) {
      logger({
        type: EConsoleType.warn,
        msg: `Unable to find translation for [${id}], used default message.`,
      });
      logger({ type: EConsoleType.error, msg: e.message });
    }
    return id;
  }
};

type ValidTagType = 'span' | 'div' | 'p';

/**
 * Returns a function that transforms an array of strings into an array of React elements.
 * Each string is wrapped in a specified HTML tag (span, div, or p).
 *
 * @param {string} type - The HTML tag type to use for wrapping each chunk ('span', 'div', or 'p').
 * @returns {(chunks: string[]) => JSX.Element[]} - A function that maps an array of strings to an array
 * of React elements, each wrapped in the specified HTML tag.
 */
export const htmlT = (
  type: string,
): ((chunks: string[]) => React.JSX.Element[]) => {
  const tagMapping: Record<ValidTagType, string> = {
    span: 'span',
    div: 'div',
    p: 'p',
  };

  const isValidTagType = (t: string): t is ValidTagType => t in tagMapping;

  const Tag = isValidTagType(type)
    ? tagMapping[type]
    : ('span' as React.ElementType);

  return (chunks: string[]) =>
    chunks.map((chunk, index) => (
      <Tag key={uniqueId(`${type}-${index}`)}>{chunk}</Tag>
    ));
};
