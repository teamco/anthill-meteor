import React, { JSX } from 'react';
import { Button, ConfigProvider, Drawer } from 'antd';
import { LeftSquareTwoTone } from '@ant-design/icons';

import './drawerPanel.module.less';
import { ReactNode } from '@tanstack/react-router';

type TPanelProps = {
  placement?: 'left' | 'right' | 'top' | 'bottom';
  size?: 'default' | 'large';
  footer?: JSX.Element;
  loading?: boolean;
  closable?: boolean;
  title?: string;
  width?: number;
  children?: ReactNode | ReactNode[];
  setDrawerPanelOpen: (open: boolean) => void;
  drawerPanelOpen: boolean;
};

/**
 * DrawerPanelComponent is a custom drawer component that can be used to display a panel on the left or right side of the screen.
 * It takes the following props:
 * - title: The title of the drawer
 * - children: The content of the drawer
 * - footer: The footer of the drawer
 * - size: The size of the drawer, either 'default' or 'large'
 * - placement: The placement of the drawer, either 'left' or 'right'
 * - loading: Whether the drawer is loading or not
 * - closable: Whether the drawer is closable or not
 * - drawerPanelOpen: Whether the drawer is open or not
 * - setDrawerPanelOpen: A function to set the state of the drawer to open or close
 *
 * It returns a Drawer component with the following props:
 * - title: The title of the drawer
 * - footer: The footer of the drawer
 * - size: The size of the drawer
 * - placement: The placement of the drawer
 * - loading: Whether the drawer is loading or not
 * - closable: Whether the drawer is closable or not
 * - open: Whether the drawer is open or not
 * - extra: A div with a button to close the drawer
 * - children: The content of the drawer
 */
export const DrawerPanelComponent: React.FC<TPanelProps> = (
  props,
): JSX.Element => {
  const {
    title,
    children,
    width = 300,
    footer = null,
    size = 'default',
    placement = 'left',
    loading = false,
    closable = false,
    drawerPanelOpen = false,
    setDrawerPanelOpen,
  } = props;

  return (
    <ConfigProvider
      theme={{
        components: {
          Drawer: {
            footerPaddingBlock: 16,
          },
        },
      }}
    >
      <Drawer
        width={width}
        className="drawer"
        destroyOnClose
        title={title}
        size={size}
        footer={footer}
        placement={placement}
        closable={closable}
        loading={loading}
        open={drawerPanelOpen}
        onClose={() => setDrawerPanelOpen(false)}
        extra={
          <div className="extra">
            <Button
              type="text"
              icon={<LeftSquareTwoTone />}
              onClick={() => setDrawerPanelOpen(false)}
            />
          </div>
        }
      >
        {children}
      </Drawer>
    </ConfigProvider>
  );
};

export default DrawerPanelComponent;
