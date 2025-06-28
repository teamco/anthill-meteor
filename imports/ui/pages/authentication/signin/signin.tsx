import { Meteor } from 'meteor/meteor';
import React, { JSX, useContext } from 'react';
import { Button, Col, Form, Input, Layout, Row, Tooltip } from 'antd';
import { NotificationInstance } from 'antd/es/notification/interface';
import { FormOutlined, LockTwoTone, LoginOutlined } from '@ant-design/icons';
import { useIntl } from 'react-intl';
import { createFileRoute, useNavigate } from '@tanstack/react-router';

import { t, TIntl } from '/imports/utils/i18n.util';
import { requiredField } from '/imports/utils/form.util';
import { layout } from '/imports/utils/layout.util';
import { catchErrorMsg } from '/imports/utils/message.util';

import { useAuthRedirect } from '/imports/ui/hooks/authRedirect.hook';

import { NotificationContext } from '/imports/ui/context/notification.context';

import { EmailField } from '/imports/ui/components/EmailField';
import { Can } from '/imports/ui/components/Ability/can';

import LoginWithGoogle from '../providers/google.provider';
import LoginWithGithub from '../providers/github.provider';

import { TRouterTypes, TNotificationError } from '/imports/config/types';

import './signin.module.less';

const { Content } = Layout;

/**
 * A React component that renders a sign-in form.
 *
 * @example
 * import Signin from '/imports/ui/authentication/signin/signin';
 *
 * <Signup />
 *
 * @returns {JSX.Element}
 */
const SignIn: React.FC = (): JSX.Element => {
  const intl: TIntl = useIntl();
  const navigate = useNavigate();

  const [formRef] = Form.useForm();

  const { notificationApi } = useContext(NotificationContext);

  const passField = t(intl, 'auth.password');

  useAuthRedirect(TRouterTypes.DASHBOARD);

  /**
   * Handles the successful form submission
   * @async
   * @param {Object} values - The form values
   * @param {string} values.email - The email address
   * @param {string} values.password - The password
   * @example
   * <Signin onFinish={(values) => console.log(values)} />
   */
  const onFinish = async (values: {
    email: string;
    password: string;
  }): Promise<void> => {
    Meteor.loginWithPassword(
      values.email,
      values.password,
      async (e): Promise<void> => {
        const error = e as TNotificationError;
        if (error) {
          return catchErrorMsg(notificationApi as NotificationInstance, error);
        }

        formRef.resetFields();
        await navigate({ to: TRouterTypes.DASHBOARD });
      },
    );
  };

  return (
    <Layout className={'lW'}>
      <Content>
        <div>
          <h1>{t(intl, 'auth.signInTitle')}</h1>
        </div>
        <Form
          size={'large'}
          layout={'vertical'}
          onFinish={onFinish}
          form={formRef}
        >
          <Row gutter={8}>
            <Col {...layout.fullColumn}>
              <EmailField size={'large'} />
            </Col>
            <Col {...layout.fullColumn}>
              <Form.Item
                name={'password'}
                label={passField}
                hasFeedback
                rules={[requiredField(intl, passField)]}
              >
                <Input.Password
                  prefix={<LockTwoTone />}
                  autoComplete={'new-password'}
                  placeholder={t(intl, 'auth.password')}
                />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item>
            <div className={'loginBtns'}>
              <Row gutter={[16, 16]}>
                <Col span={12}>
                  <Can I={'read'} a={'signup'}>
                    <Tooltip title={t(intl, 'auth.signUpTitle')}>
                      <Button
                        type={'text'}
                        icon={<LoginOutlined />}
                        disabled={false}
                        block
                        loading={false}
                        onClick={() => navigate({ to: '/signup' })}
                      >
                        {t(intl, 'auth.signUp')}
                      </Button>
                    </Tooltip>
                  </Can>
                </Col>
                <Col span={12}>
                  <Can I={'access'} a={'signin'}>
                    <Tooltip title={t(intl, 'auth.signInTitle')}>
                      <Button
                        type={'primary'}
                        htmlType={'submit'}
                        block
                        loading={false}
                        icon={<FormOutlined />}
                      >
                        {t(intl, 'auth.signIn')}
                      </Button>
                    </Tooltip>
                  </Can>
                </Col>
              </Row>
            </div>
          </Form.Item>
        </Form>
        <div className={'loginBtns'}>
          <Can I={'access'} a={'google'}>
            <LoginWithGoogle />
          </Can>
          <Can I={'access'} a={'github'}>
            <LoginWithGithub />
          </Can>
        </div>
      </Content>
    </Layout>
  );
};

export default SignIn;

export const Route = createFileRoute(TRouterTypes.SIGNIN)({
  component: SignIn,
});
