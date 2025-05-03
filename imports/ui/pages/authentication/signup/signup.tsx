import React, { JSX, useContext, useState } from 'react';
import { Button, Col, Form, Input, Layout, Row, Tooltip } from 'antd';
import {
  FormOutlined,
  LockTwoTone,
  LoginOutlined,
  ProfileTwoTone,
} from '@ant-design/icons';
import { useIntl } from 'react-intl';
import { createFileRoute, useNavigate } from '@tanstack/react-router';

import { TNotificationError } from '/imports/config/types/notification.type';
import { NotificationContext } from '/imports/ui/context/notification.context';

import { t, TIntl } from '/imports/utils/i18n.util';
import { requiredField } from '/imports/utils/form.util';
import { layout } from '/imports/utils/layout.util';
import { catchErrorMsg, successSaveMsg } from '/imports/utils/message.util';

import Strength from './utils/strength';
import { onUpdateMeter } from './utils/meter';

import { useAuthRedirect } from '/imports/ui/hooks/authRedirect.hook';

import { EmailField } from '/imports/ui/components/EmailField';
import { Can } from '/imports/ui/components/Ability/can';

import { TRouterTypes } from '/imports/config/types';

import './signup.module.less';

const { Content } = Layout;

const MIN_PASSWORD_LENGTH = 8;

/**
 * A React component that renders a sign-up form.
 *
 * @example
 * import SignUp from '/imports/ui/authentication/signup/signup';
 *
 * <Signup />
 *
 * @returns {JSX.Element}
 */
const SignUp: React.FC = (): JSX.Element => {
  const intl: TIntl = useIntl();
  const navigate = useNavigate();

  const [formRef] = Form.useForm();

  const passConfirmationField = t(intl, 'auth.passwordConfirm');
  const firstNameField = t(intl, 'profile.firstName');
  const lastNameField = t(intl, 'profile.lastName');
  const passField = t(intl, 'auth.password');

  const [meterText, setMeterText] = useState<string>('');
  const [meterValue, setMeterValue] = useState<number>(null);

  useAuthRedirect(TRouterTypes.DASHBOARD);

  const { notificationApi, messageApi } = useContext(NotificationContext);

  /**
   * Handles the successful form submission
   * @param {Object} values - The form values
   * @param {string} values.email - The email address
   * @param {string} values.password - The password
   * @param {string} values.firstName - The first name
   * @param {string} values.lastName - The last name
   * @example
   * <SignUp onSave={(values) => console.log(values)} />
   */
  const onFinish = async (values: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }) => {
    Meteor.call(
      'passwordProfile',
      {
        email: values.email,
        password: values.password,
        name: `${values.lastName} ${values.firstName}`,
      },
      async (error: TNotificationError): Promise<void> => {
        if (error) {
          return catchErrorMsg(notificationApi, error);
        }

        formRef.resetFields();

        successSaveMsg(messageApi, intl, 'User');

        await navigate({ to: TRouterTypes.SIGNIN });
      },
    );
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
  const passwordValidate = ({
    getFieldValue,
  }: {
    getFieldValue: (field: string) => string;
  }): { validator: (rule: any, value: string) => Promise<void> } => {
    const notValid: boolean =
      getFieldValue('password').length < MIN_PASSWORD_LENGTH;

    return {
      validator(_: any, value: string): Promise<void> {
        if (value && notValid) {
          return Promise.reject(
            t(intl, 'auth.passwordTooEasy', { length: MIN_PASSWORD_LENGTH }),
          );
        }
        return Promise.resolve();
      },
    };
  };

  /**
   * Validates that the password confirmation matches the original password.
   *
   * @param {object} param - An object containing form methods.
   * @param {function} param.getFieldValue - A function to retrieve the current value of the form field.
   * @returns {object} An object containing a validator function.
   * The validator function checks if the confirmation password matches the original password.
   * If they do not match, it rejects with an error message; otherwise, it resolves successfully.
   */
  const passwordConfirmValidate = ({
    getFieldValue,
  }: {
    getFieldValue: (field: string) => string;
  }): { validator: (rule: any, value: string) => Promise<void> } => {
    return {
      validator(_: any, value: string): Promise<void> {
        if (!value || getFieldValue('password') === value) {
          return Promise.resolve();
        }

        return Promise.reject(t(intl, 'auth.passwordConfirmNotValid'));
      },
    };
  };

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
                setMeterValue,
              });
              formRef.setFieldsValue({ password_confirm: '' });
            }
          }}
        >
          <Row gutter={8}>
            <Col {...layout.halfColumn}>
              <Form.Item
                name={'firstName'}
                label={firstNameField}
                rules={[requiredField(intl, firstNameField)]}
              >
                <Input
                  prefix={<ProfileTwoTone />}
                  placeholder={firstNameField}
                />
              </Form.Item>
            </Col>
            <Col {...layout.halfColumn}>
              <Form.Item
                name={'lastName'}
                label={lastNameField}
                rules={[requiredField(intl, lastNameField)]}
              >
                <Input
                  prefix={<ProfileTwoTone />}
                  placeholder={lastNameField}
                />
              </Form.Item>
            </Col>
            <Col {...layout.fullColumn}>
              <EmailField size={'large'} />
            </Col>
          </Row>
          <Row gutter={8}>
            <Col {...layout.halfColumn}>
              <Form.Item
                name={'password'}
                label={passField}
                hasFeedback
                extra={t(intl, 'auth.passwordHelper', {
                  length: MIN_PASSWORD_LENGTH,
                })}
                rules={[requiredField(intl, passField), passwordValidate]}
              >
                <Input.Password
                  prefix={<LockTwoTone />}
                  autoComplete={'new-password'}
                  placeholder={t(intl, 'auth.password')}
                />
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
                  passwordConfirmValidate,
                ]}
              >
                <Input.Password
                  prefix={<LockTwoTone />}
                  autoComplete={'new-password'}
                  placeholder={t(intl, 'auth.passwordConfirm')}
                />
              </Form.Item>
            </Col>
          </Row>
          <Strength
            className={'pStrength'}
            meterValue={meterValue}
            meterText={meterText}
          />
          <Form.Item>
            <Row gutter={[16, 16]} className={'loginBtns'}>
              <Col span={12}>
                <Can I={'read'} a={'signin'}>
                  <Tooltip title={t(intl, 'auth.signInTitle')}>
                    <Button
                      type={'text'}
                      icon={<LoginOutlined />}
                      disabled={false}
                      block
                      loading={false}
                      onClick={async () =>
                        await navigate({ to: TRouterTypes.SIGNIN })
                      }
                    >
                      {t(intl, 'auth.signIn')}
                    </Button>
                  </Tooltip>
                </Can>
              </Col>
              <Col span={12}>
                <Can I={'access'} a={'signup'}>
                  <Tooltip title={t(intl, 'auth.signUpTitle')}>
                    <Button
                      type={'primary'}
                      htmlType={'submit'}
                      block
                      loading={false}
                      icon={<FormOutlined />}
                    >
                      {t(intl, 'auth.signUp')}
                    </Button>
                  </Tooltip>
                </Can>
              </Col>
            </Row>
          </Form.Item>
        </Form>
      </Content>
    </Layout>
  );
};

export const Route = createFileRoute(TRouterTypes.SIGNUP)({
  component: SignUp,
});
