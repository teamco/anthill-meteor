import React, { JSX, useContext } from 'react';
import { Button, Col, Form, FormProps, Input, Row } from 'antd';

import { I18nContext } from '/imports/ui/context/i18n.context';

import { onModalCancel } from '/imports/utils/modal.util';
import { t } from '/imports/utils/i18n.util';
import {
  onFinishFailed,
  onValidate,
  placeholderField,
  requiredField,
  TFieldRule,
} from '/imports/utils/form.util';
import { layout } from '/imports/utils/layout.util';
import { stub } from '/imports/utils/functions.util';

import '../environments.module.less';

type TField = {
  name: string;
  description?: string;
};

type TProps = {
  disabled: boolean;
  onSave?: (values: TField) => void;
};

/**
 * @component EnvironmentNew
 * @description A form component that allows users to create a new environment by providing a name and type.
 * The form includes validation rules for each field and handles submission and cancellation actions.
 *
 * @param {TProps} props - The props for the component
 * @param {boolean} props.disabled - Determines if the form inputs should be disabled
 * @param {function} [props.onSave] - Callback function to handle the form submission with the entered values
 *
 * @returns {JSX.Element} A JSX element representing the environment creation form
 *
 * @example
 * <EnvironmentNew onSave={(values) => console.log(values)} disabled={false} />
 */
export const EnvironmentNew: React.FC<TProps> = (
  props: TProps,
): JSX.Element => {
  const { onSave = stub, disabled = false } = props;

  const intl = useContext(I18nContext);
  const [form] = Form.useForm();

  const entityMsg = t(intl, 'environment.title');
  const nameMsg = t(intl, 'form.name', { entity: entityMsg });
  const descriptionMsg = t(intl, 'form.description', { entity: entityMsg });

  const nameRule: TFieldRule = requiredField(intl, nameMsg as string);

  /**
   * @function onFinish
   * @description Handles the successful form submission
   * @param {TField} values - The form values
   * @example
   * <EnvironmentNew onSave={(values) => console.log(values)} />
   */
  const onFinish: FormProps<TField>['onFinish'] = (values: TField): void => {
    onSave(values);
    onModalCancel();
  };

  const inputProps = {
    disabled,
    autoComplete: 'off',
    autofill: 'off',
  };

  return (
    <div className="form-container">
      <Form
        layout={'vertical'}
        form={form}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete={'off'}
      >
        <Row gutter={[24, 12]}>
          <Col {...layout.fullColumn}>
            <Form.Item<TField> label={nameMsg} name="name" rules={[nameRule]}>
              <Input
                {...inputProps}
                placeholder={
                  placeholderField(
                    intl,
                    nameMsg as string,
                    'actions.enter',
                  ) as string
                }
              />
            </Form.Item>
          </Col>
          <Col {...layout.fullColumn}>
            <Form.Item<TField> label={descriptionMsg} name="description">
              <Input.TextArea
                showCount
                {...inputProps}
                maxLength={400}
                placeholder={
                  placeholderField(
                    intl,
                    descriptionMsg as string,
                    'actions.enter',
                  ) as string
                }
                style={{ maxHeight: 250, height: 100 }}
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
      <div className="form-footer">
        <Button type="default" onClick={onModalCancel}>
          {t(intl, 'actions.cancel')}
        </Button>
        <Button type="primary" onClick={(e) => onValidate(e, form)}>
          {t(intl, 'actions.save')}
        </Button>
      </div>
    </div>
  );
};
