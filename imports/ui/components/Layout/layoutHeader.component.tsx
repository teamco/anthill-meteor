import React, { Dispatch, FC, SetStateAction } from 'react';
import { LogoutOutlined, RightSquareTwoTone, SettingOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useTracker } from "meteor/react-meteor-data";
import { Dropdown, MenuProps } from 'antd';
import { useIntl } from 'react-intl';

import { t, TIntl } from '/imports/utils/i18n.util';

import './layoutHeader.module.less';

type THeaderProps = {
  title: string;
  onMenuOpen: Dispatch<SetStateAction<boolean>>
}

interface IUserProfile extends Meteor.User {
  profile: {
    name: string;
    picture: string;
  }
}

export const LayoutHeader: FC<THeaderProps> = (props): JSX.Element => {
  const { title, onMenuOpen } = props;

  const intl: TIntl = useIntl();
  const history = useNavigate();

  const user: IUserProfile = useTracker(() => Meteor.user()) as IUserProfile;

  const items: MenuProps['items'] = [
    {
      key: 'name',
      label: user?.profile?.name,
      disabled: true
    },
    {
      type: 'divider',
    },
    {
      key: 'profile',
      label: t(intl, 'profile'),
      icon: <SettingOutlined />
    },
    {
      key: 'signout',
      label: (
        <div onClick={() => Meteor.logout()}>
          {t(intl, 'auth.signOut')}
        </div>
      ),
      icon: <LogoutOutlined />
    },
  ];

  return (
    <div className='lH'>
      <div>
        <RightSquareTwoTone onClick={() => onMenuOpen(true)} />
        <h2 onClick={() => history('/dashboard')}>{title}</h2>
      </div>
      <div className='lHA'>
        <Dropdown menu={{ items }} trigger={['click']}>
          <img src={user?.profile?.picture} alt={user?.profile?.name} />
        </Dropdown>
      </div>
    </div>
  );
};
