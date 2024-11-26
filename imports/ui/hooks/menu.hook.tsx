import React, { useEffect, useState } from "react";
import { MenuProps } from "antd";
import { AppstoreAddOutlined, BlockOutlined, BookOutlined, SlidersOutlined } from '@ant-design/icons';
import { MongoAbility } from "@casl/ability/dist/types";
import { matchPath, NavigateFunction, PathMatch } from "react-router-dom";

import { t, TIntl } from "/imports/utils/i18n.util";

type MenuItem = Required<MenuProps>['items'][number];

interface LevelKeysProps {
  key?: string;
  label?: React.ReactNode;
  icon?: React.ReactNode;
  disabled?: boolean;
  children?: LevelKeysProps[];
}

/**
 * Generates an array of menu items based on the given i18n object, ability and history function.
 * The ability object is used to determine which menu items should be disabled.
 * The history function is used to navigate to the correct page when a menu item is clicked.
 * @param {TIntl} intl - The i18n object.
 * @param {MongoAbility} ability - The ability object.
 * @param {NavigateFunction} history - The history function.
 * @returns {MenuItem[]} An array of menu items.
 */
export const menuItems = (intl: TIntl, ability: MongoAbility, history: NavigateFunction): MenuItem[] => {

  const dPages = ability.cannot('read', 'Pages');
  const dDashboard = ability.cannot('read', 'Dashboard');
  const dEnvironments = ability.cannot('read', 'Environments');
  const dWidgets = ability.cannot('read', 'Widgets');

  /**
   * Generate a menu item based on the given key, label, icon, path and disabled parameter.
   * The menu item will be a link that calls the given history function when clicked, and
   * will be disabled if the disabled parameter is true.
   * @param {string} key - The key of the menu item.
   * @param {string} label - The label of the menu item.
   * @param {React.ReactNode} icon - The icon of the menu item.
   * @param {string} path - The path that the link should link to.
   * @param {boolean} disabled - Whether the menu item should be disabled.
   * @returns {MenuItem} The generated menu item.
   */
  const _child = (key: string, label: string, icon: React.ReactNode, path: string, disabled: boolean): MenuItem => ({
    key,
    icon,
    disabled,
    label: (
      <a href={path} rel="noopener noreferrer" onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();

        history(path);
      }}>
        {t(intl, label)}
      </a>
    ),
  });

  return [
    {
      key: '1',
      disabled: dPages,
      icon: <BookOutlined />,
      label: t(intl, 'menu.pages'),
      children: [
        { ..._child('10', 'dashboard.title', <BlockOutlined />, '/dashboard', dDashboard) },
        { ..._child('11', 'dashboard.environments.title', <SlidersOutlined />, '/dashboard/environments', dEnvironments) },
        { ..._child('12', 'dashboard.widgets.title', <AppstoreAddOutlined />, '/dashboard/widgets', dWidgets) },
      ],
    }
  ]
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
 * @returns {string[]} The selected menu item keys.
 */
const getSelectedKeys = (mItems: MenuItem[]): string[] => {

  const { pathname } = window.location;

  const replaceMatchers = (path: string): string => path === '/dashboard' ? path : path.replace(/\/dashboard/, '');

  /**
   * Recursively finds the selected menu item based on the given path and parent menu item keys.
   * If the item has children, it recursively calls itself with the children and the parent keys.
   * If the item does not have children, it uses matchPath to check if the item's label's href property matches the path.
   * If a match is found, it returns the parent keys, the item's key, and the matched key.
   * If no match is found, it returns null.
   * 
   * @param {MenuItem} item - The menu item to check.
   * @param {string} path - The path to check against.
   * @param {string[] | null} [parentKeys=null] - The parent menu item keys.
   * @returns {boolean} The selected menu item keys or null if no match is found.
   */
  const matcher = (item: MenuItem, path: string, parentKeys: string[] | null = null): PathMatch<any> | string | readonly string[] | boolean => {
    if (item['children']) {
      const current = item['children'].find((child: MenuItem) => matcher(child, path, [...parentKeys, item.key.toString()]));
      return current ? [...parentKeys, item.key.toString(), current.key] : null;
    }

    const _path = replaceMatchers(item['label']['props']['href']);
    const _pathname = replaceMatchers(pathname);

    return _pathname.includes(_path);
  }

  return mItems.flatMap((item: MenuItem) => matcher(item, pathname, [])) as string[];
}

/**
 * Returns the menu items, selected menu item keys, opened menu item keys and the onOpenChange handler.
 * The menu items are generated based on the given i18n object, ability and history function.
 * The selected menu item keys are determined based on the current pathname.
 * The opened menu item keys are determined based on the selected menu item keys.
 * The onOpenChange handler is used to handle the openChange event.
 * @param {TIntl} intl - The i18n object.
 * @param {MongoAbility} ability - The ability object.
 * @param {NavigateFunction} history - The history function.
 * @param {boolean} isOpen - Whether the menu is open.
 * @returns {{ mItems: MenuItem[], selectedMenuKeys: string[], openedMenuKeys: string[], onOpenChange: MenuProps['onOpenChange'] }}
 */
export const useMenu = (intl: TIntl, ability: MongoAbility, history: NavigateFunction, isOpen: boolean): { mItems: MenuItem[], selectedMenuKeys: string[], openedMenuKeys: string[], onOpenChange: MenuProps['onOpenChange'] } => {
  const [mItems, setMItems] = useState([]);
  const [selectedMenuKeys, setSelectedMenuKeys] = useState([]);
  const [openedMenuKeys, setOpenedMenuKeys] = useState([]);

  const { pathname } = window.location;

  useEffect(() => {
    isOpen && setMItems(menuItems(intl, ability, history));
  }, [intl, ability, history, isOpen]);

  const levelKeys = getLevelKeys(mItems as LevelKeysProps[]);

  useEffect(() => {
    if (isOpen) {
      const selectedKeys = getSelectedKeys(mItems);
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
  const onOpenChange: MenuProps['onOpenChange'] = (openKeys: string[]): void => {
    const currentOpenKey = openKeys.find((key) => openedMenuKeys.indexOf(key) === -1);

    // Open
    if (currentOpenKey !== undefined) {
      const repeatIndex = openKeys.
        filter((key) => key !== currentOpenKey).
        findIndex((key) => levelKeys[key] === levelKeys[currentOpenKey]);

      setOpenedMenuKeys(
        openKeys.
          // Remove repeat key
          filter((_, index) => index !== repeatIndex).
          // Remove current level all child
          filter((key) => levelKeys[key] <= levelKeys[currentOpenKey]),
      );
    } else {

      // Close
      setOpenedMenuKeys(openKeys);
    }
  };

  return { mItems, selectedMenuKeys, openedMenuKeys, onOpenChange };
};