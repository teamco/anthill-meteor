import React, { useCallback, useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { MenuProps } from 'antd';
import {
  AppstoreAddOutlined,
  BlockOutlined,
  BookOutlined,
  SlidersOutlined,
  UnorderedListOutlined,
} from '@ant-design/icons';
import { MongoAbility } from '@casl/ability/dist/types';
import {
  NavigateOptions,
  useLocation,
  useNavigate,
} from '@tanstack/react-router';

import { t, TIntl } from '/imports/utils/i18n.util';
import { TRouterTypes } from '/imports/config/types';
import { ItemType, MenuItemType } from 'antd/es/menu/interface';

type NavigateFunction = (options: NavigateOptions) => Promise<void>;
type MenuItem = Required<MenuProps>['items'][number];

interface LevelKeysProps {
  key?: string;
  label?: React.ReactNode;
  icon?: React.ReactNode;
  disabled?: boolean;
  children?: LevelKeysProps[];
}

export type TUseMenu = {
  mItems: MenuItem[];
  selectedMenuKeys: string[];
  openedMenuKeys: string[];
  onOpenChange: (openKeys: string[]) => void;
};

/**
 * Generates an array of menu items based on the given i18n object, ability and navigate function.
 * The ability object is used to determine which menu items should be disabled.
 * The navigate function is used to navigate to the correct page when a menu item is clicked.
 * @param {TIntl} intl - The i18n object.
 * @param {MongoAbility} ability - The ability object.
 * @param navigate - The navigate function.
 * @param {React.Dispatch<React.SetStateAction<boolean>>} setDrawerPanelOpen - Function to set the drawer panel open state.
 * @returns {MenuItem[]} An array of menu items.
 */
export const menuItems = (
  intl: TIntl,
  ability: MongoAbility,
  navigate: NavigateFunction,
  setDrawerPanelOpen: React.Dispatch<React.SetStateAction<boolean>>,
): MenuItem[] => {
  const dPages = ability.cannot('read', 'Pages');
  const dDashboard = ability.cannot('read', 'Dashboard');
  const dEnvironments = ability.cannot('read', 'Environments');
  const dWidgets = ability.cannot('read', 'Widgets');
  const dUserLogs = ability.cannot('read', 'UserLogs');

  const _childLabel = (label: string, path: string): React.ReactNode => (
    <a
      href={path}
      rel="noopener noreferrer"
      onClick={async (e) => {
        e.preventDefault();
        e.stopPropagation();

        await navigate({ to: path });

        setDrawerPanelOpen(false);
      }}
    >
      {t(intl, label)}
    </a>
  );

  const _child = (
    key: string,
    label: string,
    icon: React.ReactNode,
    path: string,
    disabled: boolean,
  ): MenuItem => ({
    key,
    icon,
    disabled,
    label: _childLabel(label, path),
  });

  const _dashboard = {
    ..._child(
      '10',
      'dashboard.title',
      <BlockOutlined />,
      TRouterTypes.DASHBOARD,
      dDashboard,
    ),
  } as ItemType<MenuItemType>;

  const _environments = {
    ..._child(
      '11',
      'dashboard.environments.title',
      <SlidersOutlined />,
      TRouterTypes.DASHBOARD_ENVIRONMENTS,
      dEnvironments,
    ),
  } as ItemType<MenuItemType>;

  const _widgets = {
    ..._child(
      '12',
      'dashboard.widgets.title',
      <AppstoreAddOutlined />,
      TRouterTypes.DASHBOARD_WIDGETS,
      dWidgets,
    ),
  } as ItemType<MenuItemType>;

  const _userLogs = {
    ..._child(
      '15',
      'dashboard.userLogs.title',
      <UnorderedListOutlined />,
      TRouterTypes.DASHBOARD_USER_LOGS,
      dUserLogs,
    ),
  } as ItemType<MenuItemType>;

  return [
    {
      key: '1',
      disabled: dPages,
      icon: <BookOutlined />,
      label: t(intl, 'menu.pages'),
      children: [_dashboard, _environments, _widgets, _userLogs],
    },
  ];
};

/**
 * Generate a record of menu item keys to their levels.
 *
 * @param {LevelKeysProps[]} items1 - Menu items.
 * @returns {Record<string, number>} - A record of menu item keys to their levels.
 */
const getLevelKeys = (items1: LevelKeysProps[]): Record<string, number> => {
  const key: Record<string, number> = {};

  /**
   * Recursively assigns a level number to each menu item's key.
   *
   * @param {LevelKeysProps[]} items2 - The list of menu items to process.
   * @param {number} [level=1] - The current level of menu items being processed.
   * Each item's key is mapped to this level.
   * Defaults to 1 for the top-level items.
   */
  const func = (items2: LevelKeysProps[], level: number = 1): void => {
    items2.forEach((item) => {
      if (item.key) {
        key[item.key] = level;
      }
      if (item.children) {
        func(item.children, level + 1);
      }
    });
  };

  func(items1);

  return key;
};

/**
 * Get the selected menu item keys based on the current pathname.
 * @param {MenuItem[]} mItems - The menu items.
 * @param {string} pathname
 * @returns {string[]} The selected menu item keys.
 */
const getSelectedKeys = (mItems: MenuItem[], pathname: string): string[] => {
  const replaceMatchers = (path: string): string =>
    path === TRouterTypes.DASHBOARD ? path : path.replace(/\/dashboard/, '');

  type TMatcherItem = {
    key: string;
    children?: TMatcherItem[] | undefined;
    label: {
      props: {
        href: string;
      };
    };
  };

  const matcher = (
    item: TMatcherItem,
    path: string,
    parentKeys: string[] = [],
  ): boolean | null | any[] => {
    if (!item) {
      console.error('MenuItem is undefined');
      return false;
    }

    const children = item.children as MenuItem[] | undefined;
    if (children?.length) {
      if (children) {
        const current = children.find((child: MenuItem) =>
          matcher(child as TMatcherItem, path, [
            ...parentKeys,
            item.key.toString(),
          ]),
        );
        return current
          ? [...parentKeys, item.key.toString(), current.key]
          : null;
      }
    }

    const _path = replaceMatchers(item['label']['props']['href']);
    const _pathname = replaceMatchers(path);

    return _pathname.includes(_path);
  };

  return mItems.flatMap((item: MenuItem) =>
    matcher(item as TMatcherItem, pathname, []),
  ) as unknown as string[];
};

/**
 * Returns the menu items, selected menu item keys, opened menu item keys and the onOpenChange handler.
 * The menu items are generated based on the given i18n object, ability and navigate function.
 * The selected menu item keys are determined based on the current pathname.
 * The opened menu item keys are determined based on the selected menu item keys.
 * The onOpenChange handler is used to handle the openChange event.
 * @param {MongoAbility} ability - The ability object.
 * @param {boolean} isOpen - Whether the menu is open.
 * @param setDrawerPanelOpen
 * @returns {TUseMenu}
 */
export const useMenu = (
  ability: MongoAbility,
  isOpen: boolean,
  setDrawerPanelOpen: React.Dispatch<React.SetStateAction<boolean>>,
): TUseMenu => {
  const intl: TIntl = useIntl();
  const navigate = useNavigate();

  const [mItems, setMItems] = useState<ItemType[]>([]);
  const [selectedMenuKeys, setSelectedMenuKeys] = useState<string[]>([]);
  const [openedMenuKeys, setOpenedMenuKeys] = useState<string[]>([]);

  const { pathname } = useLocation();

  useEffect(() => {
    if (isOpen)
      setMItems(menuItems(intl, ability, navigate, setDrawerPanelOpen));
  }, [intl, ability, isOpen]);

  const levelKeys = getLevelKeys(mItems as LevelKeysProps[]);

  useEffect(() => {
    if (isOpen) {
      const selectedKeys = getSelectedKeys(mItems, pathname);
      setSelectedMenuKeys(selectedKeys);
      setOpenedMenuKeys(selectedKeys);
    }
  }, [mItems, pathname, isOpen]);

  /**
   * Function to handle openChange event.
   * @param {string[]} openKeys The keys of open menu items.
   * When a menu item is opened, it will remove the key of the same level
   * and all child keys from the stateOpenKeys.
   * When a menu item is closed, it will add all of its child keys to the stateOpenKeys.
   * @return {void} No return value.
   */
  const onOpenChange: MenuProps['onOpenChange'] =
    useCallback(
      (openKeys: string[]): void => {
        const currentOpenKey = openKeys.find(
          (key: string) => openedMenuKeys.indexOf(key) === -1,
        );

        if (currentOpenKey !== undefined) {
          const repeatIndex = openKeys
            .filter((key) => key !== currentOpenKey)
            .findIndex((key) => levelKeys[key] === levelKeys[currentOpenKey]);

          setOpenedMenuKeys(
            openKeys
              .filter((_, index) => index !== repeatIndex)
              .filter((key) => levelKeys[key] <= levelKeys[currentOpenKey]),
          );
        } else {
          setOpenedMenuKeys(openKeys);
        }
      },
      [levelKeys, openedMenuKeys],
    ) ?? (() => {});

  return { mItems, selectedMenuKeys, openedMenuKeys, onOpenChange };
};
