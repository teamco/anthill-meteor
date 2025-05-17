import React, { JSX } from 'react';
import { MailTwoTone } from '@ant-design/icons';
import { Form, FormItemProps, Input } from 'antd';
import { useIntl } from 'react-intl';

import { t } from '/imports/utils/i18n.util';
import {
  fieldName,
  placeholderField,
  requiredField,
} from '/imports/utils/form.util';

interface IEmailFieldProps extends FormItemProps {
  ns?: string;
  name?: string;
  disabled?: boolean;
  required?: boolean;
  className?: string;
  size?: 'small' | 'middle' | 'large';
  autoComplete?: string;
  placeholder?: string;
  prefix?: JSX.Element;
  suffix?: JSX.Element;
}

/**
 * A react component that renders a form item with a single email input.
 * Accepts a props object with the following properties:
 *   ns: string - the namespace to use for the form item name
 *   name: string - the name of the form item
 *   disabled: boolean - whether the input is disabled
 *   required: boolean - whether the form item is required
 *   className: string - a class to apply to the form item
 *   size: SizeType - the size of the input
 *   autoComplete: string - the autocomplete value for the input
 *   prefix: JSX.Element - an element to display before the input
 *   suffix: JSX.Element - an element to display after the input
 * Returns a JSX element representing the form item.
 */
export const EmailField: React.FC<IEmailFieldProps> = (props): JSX.Element => {
  const intl = useIntl();

  const {
    ns = '',
    name = 'email',
    disabled = false,
    required = true,
    className,
    size = 'middle',
    autoComplete = 'off',
    prefix = <MailTwoTone />,
    suffix = null,
  } = props;

  const emailMsg = t(intl, 'form.email');

  const emailProps: FormItemProps = {
    label: emailMsg,
    className,
    name: fieldName(ns, name),
    extra: t(intl, 'auth.emailHelper'),
    rules: [
      { type: 'email', message: t(intl, 'auth.emailNotValid') },
      requiredField(intl, emailMsg, required),
    ],
  };

  return (
    <Form.Item {...emailProps}>
      <Input
        prefix={prefix}
        suffix={suffix}
        size={size}
        disabled={disabled}
        autoComplete={autoComplete}
        placeholder={placeholderField(intl, emailMsg, 'actions.enter')}
      />
    </Form.Item>
  );
};
