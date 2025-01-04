import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Button } from 'antd';
import { GoogleOutlined } from '@ant-design/icons';

import '../signin/signin.module.less';

const LoginWithGoogle = () => {
  const handleGoogleLogin = () => {
    Meteor.loginWithGoogle({
      requestPermissions: ['email', 'profile'],
      loginStyle: 'popup'
    });
  };

  return (
    <Button type='primary' icon={<GoogleOutlined />} onClick={handleGoogleLogin}/>
  );
};

export default LoginWithGoogle;
