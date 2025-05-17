import { Menu } from 'antd';
import React, { JSX } from 'react';
import classnames from 'classnames';
import { ItemType } from 'antd/es/menu/interface';

import './menu.module.less';

type TMenuProps = {
  className?: string;
  mItems: ItemType[];
  selectedMenuKeys: string[];
  openedMenuKeys: string[];
  onOpenChange: (openKeys: string[]) => void;
};

/**
 * @component MenuComponent
 * @description A component that renders an inline menu using Ant Design's Menu component.
 * It accepts menu items, selected keys, and an open change handler.
 *
 * @param {TMenuProps} props - The props for the component
 * @param {string} [props.className] - Optional additional class name for the menu
 * @param {any} props.mItems - An array of menu items to be rendered
 * @param {string[]} props.selectedMenuKeys - An array of keys for the selected menu items
 * @param {string[]} [props.openedMenuKeys] - Optional array of keys for the opened menu items
 * @param {function} [props.onOpenChange] - Optional handler for the open change event
 *
 * @returns {JSX.Element} The rendered menu component
 */
export const MenuComponent: React.FC<TMenuProps> = (
  props: TMenuProps,
): JSX.Element => {
  const { className, mItems, selectedMenuKeys, onOpenChange, openedMenuKeys } =
    props;

  return (
    <Menu
      className={classnames('menu', className)}
      mode={'inline'}
      items={mItems}
      defaultSelectedKeys={[...selectedMenuKeys]}
      onOpenChange={onOpenChange}
      openKeys={openedMenuKeys ? [...openedMenuKeys] : []}
      selectedKeys={[...selectedMenuKeys]}
    />
  );
};
