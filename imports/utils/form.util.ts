import React from 'react';
import { FormInstance, FormProps, Rule } from 'antd/es/form';

import { t, TIntl } from '/imports/utils/i18n.util';

export type TFieldRule = {
  required?: boolean;
  message?: string;
} & Rule;

/**
 * Generates a validation rule for a required field.
 *
 * @param {TIntl} intl - The internationalization object used for message translation.
 * @param {string} field - The field name to be included in the validation message.
 * @param {boolean} [required=true] - Indicates whether the field is required.
 * @returns {TFieldRule} The validation rule object.
 */
export const requiredField = (
  intl: TIntl,
  field: string,
  required: boolean = true,
): TFieldRule => {
  const rule: TFieldRule = {
    required,
    message: t(intl, 'event.field.required', { field }),
  };

  return rule;
};

export const urlFieldValidation = [
  { type: 'url', warningOnly: true },
  { type: 'string', min: 6 },
];

/**
 * Generates a placeholder string for a form field.
 *
 * @param {TIntl} intl - The intl object to use for translation.
 * @param {string} label - The label to use in the placeholder string.
 * @param {string} msg - The message to use in the placeholder string.
 * @returns {string} The placeholder string.
 */
export const placeholderField = (
  intl: TIntl,
  label: string,
  msg: string = 'actions.select',
): string => {
  return t(intl, 'form.placeholder', {
    field: label,
    type: t(intl, msg),
  });
};

/**
 * @function onFinishFailed
 * @description Handles the case when the form submission fails with validation errors
 * @param {Object} errorInfo - The error information object
 * @example
 * {
 *   values: {
 *     name: "My Environment"
 *   },
 *   errorFields: [
 *     {
 *       name: ["name"],
 *       errors: ["Please input your name!"]
 *     }
 *   ],
 *   outOfDate: false
 * }
 */
export const onFinishFailed: FormProps<any>['onFinishFailed'] = (
  errorInfo: object,
): void => {
  console.warn(errorInfo);
};

/**
 * @function onValidate
 * @description Validates the form and submits it if the validation is successful
 * @returns {void}
 * @example
 * <button onClick={onValidate}>Save</button>
 */
export const onValidate = (
  e: React.MouseEvent<HTMLElement, MouseEvent>,
  form: FormInstance<unknown>,
): void => {
  e.preventDefault();

  form
    .validateFields()
    .then(() => {
      form.submit();
    })
    .catch(onFinishFailed);
};

/**
 * Constructs an array of field names by concatenating namespace(s) and name(s).
 *
 * @param {string | string[]} namespace - A single namespace or an array of namespaces.
 * @param {string | string[]} names - A single name or an array of names.
 * @returns {string[]} An array of concatenated namespace(s) and name(s).
 * If namespaces are provided, they will be prepended to each name.
 * If no namespace is provided, only names are returned.
 */
export const fieldName = (
  namespace: string | string[],
  names: string | string[],
): string[] => {
  const fields = Array.isArray(names) ? names : [names];
  const ns = Array.isArray(namespace) ? namespace : [namespace];

  return (ns ? [...ns, ...fields] : [...fields]).filter(Boolean);
};
