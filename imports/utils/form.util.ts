import { Rule } from 'antd/es/form';

import { t, TIntl } from '/imports/utils/i18n.util';
import { stub } from '/imports/utils/functions.util';

import { catchWarnMsg } from './message.util';

export type TFieldRule = {
  required?: boolean,
  message?: string
} & Rule;

/**
 * Generates a validation rule for a required field.
 *
 * @param {TIntl} intl - The internationalization object used for message translation.
 * @param {any} field - The field name to be included in the validation message.
 * @param {boolean} [required=true] - Indicates whether the field is required.
 * @returns {TFieldRule} The validation rule object.
 */
export const requiredField = (intl: TIntl, field: any, required: boolean = true): TFieldRule => {
  const rule: TFieldRule = {
    required,
    message: t(intl, 'event.field.required', { field })
  };

  return rule;
};

export const urlFieldValidation = [
  { type: 'url', warningOnly: true },
  { type: 'string', min: 6 }
];

/**
 * Generates a placeholder string for a form field.
 *
 * @param {TIntl} intl - The intl object to use for translation.
 * @param {string} label - The label to use in the placeholder string.
 * @param {string} msg - The message to use in the placeholder string.
 * @returns {string} The placeholder string.
 */
export const placeholderField = (intl: TIntl, label: string, msg: string = 'actions.select'): string => {
  return t(intl, 'form.placeholder', {
    field: label,
    type: t(intl, msg)
  });
};

export const validateFields = (formRef, handler = stub) => {
  formRef.validateFields().then(() => {
    handler();
  }).catch(catchWarnMsg);
};