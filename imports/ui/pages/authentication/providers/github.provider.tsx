import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Button } from 'antd';
import { GithubOutlined } from '@ant-design/icons';

import '../signin/signin.module.less';

const LoginWithGithub = (): React.JSX.Element => {
  const handleGithubLogin = () => {
    Meteor.loginWithGithub({
      requestPermissions: ['user'],
      loginStyle: 'popup',
    });
  };

  return (
    <Button
      type="primary"
      icon={<GithubOutlined />}
      onClick={handleGithubLogin}
    />
  );
};

export default LoginWithGithub;
