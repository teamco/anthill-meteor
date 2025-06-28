import React, { Dispatch, FC, SetStateAction } from 'react';
import { Meteor } from 'meteor/meteor';
import {
  LogoutOutlined,
  RightSquareTwoTone,
  SettingOutlined,
} from '@ant-design/icons';
import { useNavigate } from '@tanstack/react-router';
import { useTracker } from 'meteor/react-meteor-data';
import { Dropdown, MenuProps } from 'antd';
import { useIntl } from 'react-intl';
import classnames from 'classnames';

import { IUserProfile, TRouterTypes } from '/imports/config/types';

import { t, TIntl } from '/imports/utils/i18n.util';

import './layoutHeader.module.less';

type THeaderProps = {
  title: string;
  onMenuOpen: Dispatch<SetStateAction<boolean>>;
};

/**
 * A functional component that renders a layout header
 *
 * @param {{ title: string, onMenuOpen: Dispatch<SetStateAction<boolean>> }} props - The component props
 * @param {string} props.title - The title to be displayed as the header
 * @param {Dispatch<SetStateAction<boolean>>} props.onMenuOpen - A callback to open the menu
 *
 * @returns {JSX.Element} The rendered header component
 */
export const LayoutHeader: FC<THeaderProps> = (props: {
  title: string;
  onMenuOpen: Dispatch<SetStateAction<boolean>>;
}): React.JSX.Element => {
  const { title, onMenuOpen } = props;

  const intl: TIntl = useIntl();
  const navigate = useNavigate();

  const user: IUserProfile = useTracker(() => Meteor.user()) as IUserProfile;

  const handleSignOut = () => {
    Meteor.logout(() => {
      navigate({ to: TRouterTypes.SIGNIN });
    });
  };

  const handleProfile = () => {
    navigate({ to: TRouterTypes.PROFILE });
  };

  const items: MenuProps['items'] = [
    {
      key: 'name',
      label: user?.profile?.name,
      disabled: true,
    },
    {
      type: 'divider',
    },
    {
      key: 'profile',
      label: <div onClick={handleProfile}>{t(intl, 'profile')}</div>,
      icon: <SettingOutlined />,
    },
    {
      key: 'signout',
      label: (
        <div onClick={handleSignOut}>{t(intl, 'auth.signOut')}</div>
      ) as React.ReactNode,
      icon: <LogoutOutlined />,
    },
  ];

  return (
    <div className="lH">
      <div>
        <RightSquareTwoTone onClick={() => onMenuOpen(true)} />
        <h2 onClick={() => navigate({ to: TRouterTypes.DASHBOARD })}>
          {title}
        </h2>
      </div>
      <div className="lHA">
        <Dropdown menu={{ items }} trigger={['click']}>
          <div className={classnames('avatar', { success: navigator.onLine })}>
            <img
              src={user?.profile?.picture}
              alt={user?.profile?.name}
              referrerPolicy="no-referrer"
            />
            <div />
          </div>
        </Dropdown>
      </div>
    </div>
  );
};
