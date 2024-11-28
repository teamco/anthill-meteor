import React, { useState } from 'react';
import { Button, Col, Divider, Form, Input, Layout, Row, Tooltip } from 'antd';

import { useIntl } from 'react-intl';
import { t, TIntl } from '/imports/utils/i18n.util';
import { useNavigate } from 'react-router-dom';
import { FormOutlined, LockTwoTone, LoginOutlined, ProfileTwoTone } from '@ant-design/icons';
import Strength from './sections/strength';
import { requiredField } from '/imports/utils/form.util';
import { onUpdateMeter } from './sections/meter';
import { EmailField } from '../../components/EmailField';

import './signup.module.less';
import { layout } from '/imports/utils/layout.util';

const { Content } = Layout;

const MIN_PASSWORD_LENGTH = 8;

/**
 * @constant
 * @param props
 * @returns {JSX.Element}
 */
const Signup = props => {
  const intl: TIntl = useIntl();
  const history = useNavigate();

  const [formRef] = Form.useForm();

  const passConfirmationField = t(intl, 'auth.passwordConfirm');
  const firstNameField = t(intl, 'profile.firstName');
  const lastNameField = t(intl, 'profile.lastName');
  const passField = t(intl, 'auth.password');

  const [meterText, setMeterText] = useState<string>('');
  const [meterValue, setMeterValue] = useState<number>(null);

  const onFinish = (values) => {
    // formRef.resetFields();
    // history('/signin');
  };

  /**
   * Validates that the password length is at least the minimum length.
   *
   * @param {{ getFieldValue: (field: string) => string }} param - An object containing form methods.
   * @param {string} param.getFieldValue - A function to retrieve the current value of the form field.
   * @returns {{ validator: (rule: any, value: string) => Promise<void> }} An object containing a validator function.
   * The validator function checks if the password length is at least the minimum length.
   * If it is not, it rejects with an error message; otherwise, it resolves successfully.
   */
  const passwordValidate = ({ getFieldValue }: { getFieldValue: (field: string) => string; }): { validator: (rule: any, value: string) => Promise<void> } => {
    const notValid: boolean = getFieldValue('password').length < MIN_PASSWORD_LENGTH;

    return {
      validator(_: any, value: string) {
        if (value && notValid) {
          return Promise.reject(t(intl, 'auth.passwordTooEasy', { length: MIN_PASSWORD_LENGTH }));
        }
        return Promise.resolve();
      }
    }
  }

  /**
   * Validates that the password confirmation matches the original password.
   *
   * @param {object} param - An object containing form methods.
   * @param {function} param.getFieldValue - A function to retrieve the current value of the form field.
   * @returns {object} An object containing a validator function.
   * The validator function checks if the confirmation password matches the original password.
   * If they do not match, it rejects with an error message; otherwise, it resolves successfully.
   */
  const passwordConfirmValidate = ({ getFieldValue }: { getFieldValue: (field: string) => string; }): { validator: (rule: any, value: string) => Promise<void> } => {
    const notValid: boolean = getFieldValue('password') !== getFieldValue('password_confirm');

    return {
      validator(_: any, value: string) {
        if (value && notValid) {
          return Promise.reject(t(intl, 'auth.passwordConfirmNotValid'));
        }
        return Promise.resolve();
      }
    }
  }

  return (
    <Layout className={'rW'}>
      <Content>
        <div>
          <h1>{t(intl, 'auth.signUpTitle')}</h1>
          <h3>{t(intl, 'auth.signUpDesc')}</h3>
        </div>
        <Form
          size={'large'}
          layout={'vertical'}
          onFinish={onFinish}
          form={formRef}
          onValuesChange={(changedValues) => {
            if (changedValues.password) {
              onUpdateMeter({
                value: changedValues.password,
                setMeterText,
                setMeterValue
              });
              formRef.setFieldsValue({ password_confirm: '' });
            }

            if (changedValues.password_confirm) {
              if (changedValues.password_confirm !== changedValues.password) {
                formRef.setFieldsValue({ password_confirm: '' });
              }
            }
          }}
        >
          <Form.Item>
            <Row gutter={8}>
              <Col {...layout.halfColumn}>
                <Form.Item
                  name={'firstName'}
                  label={firstNameField}
                  rules={[requiredField(intl, firstNameField)]}>
                  <Input prefix={<ProfileTwoTone />}
                    placeholder={firstNameField} />
                </Form.Item>
              </Col>
              <Col {...layout.halfColumn}>
                <Form.Item
                  name={'lastName'}
                  label={lastNameField}
                  rules={[requiredField(intl, lastNameField)]}>
                  <Input prefix={<ProfileTwoTone />}
                    placeholder={lastNameField} />
                </Form.Item>
              </Col>
            </Row>
          </Form.Item>
          <EmailField size={'large'} />
          <Form.Item>
            <Row gutter={8}>
              <Col {...layout.halfColumn}>
                <Form.Item
                  name={'password'}
                  label={passField}
                  hasFeedback
                  extra={t(intl, 'auth.passwordHelper', { length: MIN_PASSWORD_LENGTH })}
                  rules={[
                    requiredField(intl, passField),
                    passwordValidate
                  ]}>
                  <Input.Password prefix={<LockTwoTone />}
                    autoComplete={'new-password'}
                    placeholder={t(intl, 'auth.password')} />
                </Form.Item>
              </Col>
              <Col {...layout.halfColumn}>
                <Form.Item
                  label={passConfirmationField}
                  name={'password_confirm'}
                  dependencies={['password']}
                  hasFeedback
                  rules={[
                    requiredField(intl, passConfirmationField),
                    passwordConfirmValidate
                  ]}>
                  <Input.Password
                    prefix={<LockTwoTone />}
                    autoComplete={'new-password'}
                    placeholder={t(intl, 'auth.passwordConfirm')} />
                </Form.Item>
              </Col>
            </Row>
            <Strength
              className={'pStrength'}
              meterValue={meterValue}
              meterText={meterText}
            />
          </Form.Item>
          <Form.Item>
            <Row gutter={[16, 16]}
              className={'loginBtns'}>
              <Col span={12}>
                <Tooltip title={t(intl, 'auth.signInTitle')}>
                  <Button type={'text'}
                    icon={<LoginOutlined />}
                    disabled={false}
                    block
                    loading={false}
                    onClick={() => history('/login')}>
                    {t(intl, 'auth.signIn')}
                  </Button>
                </Tooltip>
              </Col>
              <Col span={12}>
                <Tooltip title={t(intl, 'auth.signUpTitle')}>
                  <Button type={'primary'}
                    htmlType={'submit'}
                    block
                    loading={false}
                    icon={<FormOutlined />}>
                    {t(intl, 'auth.signUp')}
                  </Button>
                </Tooltip>
              </Col>
            </Row>
          </Form.Item>
        </Form>
      </Content>
    </Layout>
  );
};

export default Signup;
