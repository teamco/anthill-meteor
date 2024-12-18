import React, { JSX } from 'react';
import { Button, Col, Form, Input, Layout, notification, Row, Tooltip } from 'antd';
import { FormOutlined, LockTwoTone, LoginOutlined } from '@ant-design/icons';
import { useIntl } from 'react-intl';
import { useNavigate } from 'react-router-dom';

import { t, TIntl } from '/imports/utils/i18n.util';
import { requiredField } from '/imports/utils/form.util';
import { layout } from '/imports/utils/layout.util';
import { catchErrorMsg, nCache, TError } from '/imports/utils/message.util';

import { useAuthRedirect } from '/imports/ui/hooks/authRedirect.hook';

import { EmailField } from '/imports/ui/components/EmailField';
import { Can } from '/imports/ui/components/Ability/can';

import './signin.module.less';

const { Content } = Layout;

/**
 * A react component that renders a sign in form.
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
  const history = useNavigate();

  const [formRef] = Form.useForm();

  const [notificationApi, notificationHolder] = notification.useNotification({
    stack: { threshold: 3 }
  });

  nCache.set('notificationApi', notificationApi);

  const passField = t(intl, 'auth.password');

  useAuthRedirect('/dashboard');

  /**
   * Handles the successful form submission
   * @param {Object} values - The form values
   * @param {string} values.email - The email address
   * @param {string} values.password - The password
   * @example
   * <Signin onFinish={(values) => console.log(values)} />
   */
  const onFinish = (values: { email: string; password: string; }): void => {

    Meteor.loginWithPassword(values.email, values.password, (err): void => {
      if (err) {
        return catchErrorMsg(err as TError);
      }

      formRef.resetFields();
      history('/dashboard');
    });
  };

  return (
    <Layout className={'lW'}>
      <Content>
        <div><h1>{t(intl, 'auth.signInTitle')}</h1></div>
        {notificationHolder}
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
                <Input.Password prefix={<LockTwoTone />}
                  autoComplete={'new-password'}
                  placeholder={t(intl, 'auth.password')} />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item>
            <Row gutter={[16, 16]}
              className={'loginBtns'}>
              <Col span={12}>
                <Can I={'read'} a={'signup'}>
                  <Tooltip title={t(intl, 'auth.signUpTitle')}>
                    <Button type={'text'}
                      icon={<LoginOutlined />}
                      disabled={false}
                      block
                      loading={false}
                      onClick={() => history('/signup')}>
                      {t(intl, 'auth.signUp')}
                    </Button>
                  </Tooltip>
                </Can>
              </Col>
              <Col span={12}>
                <Can I={'access'} a={'signin'}>
                  <Tooltip title={t(intl, 'auth.signInTitle')}>
                    <Button type={'primary'}
                      htmlType={'submit'}
                      block
                      loading={false}
                      icon={<FormOutlined />}>
                      {t(intl, 'auth.signIn')}
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

export default SignIn;
