import React, { JSX, useContext } from "react";
import { Button, Col, Form, FormProps, Input, Row } from "antd";

import { I18nContext } from "/imports/ui/context/i18n.context";

import { t } from "/imports/utils/i18n.util";
import { placeholderField, requiredField, TFieldRule } from "/imports/utils/form.util";
import { layout } from '/imports/utils/layout.util';
import { onModalCancel } from "/imports/utils/antd.util";
import { stub } from "/imports/utils/functions.util";

import '../widgets.module.less';

type TField = {
  name?: string;
  path?: string;
};

type TProps = {
  disabled: boolean,
  onSave?: (values: TField) => void
}

/**
 * @component WidgetNew
 * @description A form component that allows users to create a new widget by providing a name and type.
 * The form includes validation rules for each field and handles submission and cancellation actions.
 * 
 * @param {TProps} props - The props for the component
 * @param {boolean} props.disabled - Determines if the form inputs should be disabled
 * @param {function} [props.onSave] - Callback function to handle the form submission with the entered values
 * 
 * @returns {JSX.Element} A JSX element representing the widget creation form
 * 
 * @example
 * <WidgetNew onSave={(values) => console.log(values)} disabled={false} />
 */
export const WidgetNew: React.FC<TProps> = (props): JSX.Element => {
  const { onSave = stub, disabled = false } = props;

  const intl = useContext(I18nContext);
  const [form] = Form.useForm();

  const nameMsg = t(intl, 'widget.name');
  const pathMsg = t(intl, 'widget.working.path');

  const nameRule: TFieldRule = requiredField(intl, nameMsg);
  const pathRule: TFieldRule = requiredField(intl, pathMsg);

  /**
   * @function onFinish
   * @description Handles the successful form submission
   * @param {TField} values - The form values
   * @example
   * <WidgetNew onSave={(values) => console.log(values)} />
   */
  const onFinish: FormProps<TField>['onFinish'] = (values: TField): void => {
    onSave(values);
    onModalCancel();
  };

  /**
   * @function onFinishFailed
   * @description Handles the case when the form submission fails with validation errors
   * @param {Object} errorInfo - The error information object
   * @example
   * {
   *   values: {
   *     name: "My Widget"
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
  const onFinishFailed: FormProps<TField>['onFinishFailed'] = (errorInfo: object): void => {
    console.warn(errorInfo);
  };

  /**
   * @function onValidate
   * @description Validates the form and submits it if the validation is successful
   * @returns {void}
   * @example
   * <button onClick={onValidate}>Save</button>
   */
  const onValidate = (): void => {
    form.validateFields().then(() => {
      form.submit();
    }).catch(onFinishFailed);
  }

  const inputProps = {
    disabled,
    autoComplete: 'off',
    autofill: 'off'
  };

  return (
    <div className='form-container'>
      <Form
        layout={"vertical"}
        form={form}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete={"off"}
      >
        <Row gutter={[24, 12]}>      
          <Col {...layout.halfColumn}>
            <Form.Item<TField>
              label={nameMsg}
              name="name"
              rules={[nameRule]}
            >
              <Input {...inputProps} placeholder={placeholderField(intl, nameMsg, 'actions.enter')} />
            </Form.Item>
          </Col>
          <Col {...layout.halfColumn}>
            <Form.Item<TField>
              label={pathMsg}
              name="path"
              extra={t(intl, 'widget.working.path.extra')}
              rules={[pathRule]}
            >
              <Input {...inputProps} placeholder={placeholderField(intl, pathMsg, 'actions.enter')} />
            </Form.Item>
          </Col>
        </Row>
      </Form>
      <div className='form-footer'>
        <Button type="default" onClick={onModalCancel}>{t(intl, 'actions.cancel')}</Button>
        <Button type="primary" onClick={onValidate}>{t(intl, 'actions.save')}</Button>
      </div>
    </div>
  );
};