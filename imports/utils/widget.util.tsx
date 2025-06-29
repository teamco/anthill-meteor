import { useContext } from 'react';

import { catchClassErrorMsg } from './message.util';

import { IUser, TWidget } from '../config/types';

import Widget from '../api/environment/Widget';

import { NotificationContext } from '../ui/context/notification.context';
import { I18nContext } from '../ui/context/i18n.context';

/**
 * Import a widget module given its path and call the callback with the new
 * widget instance.
 *
 * @async
 * @param path - The path to the widget module.
 * @param user - The user who is importing the widget.
 * @returns {TWidget} The new widget instance.
 */
export const importWidget = async (
  path: string,
  user: IUser,
): Promise<TWidget | null> => {
  const { notificationApi } = useContext(NotificationContext);
  const intl = useContext(I18nContext);

  if (!path) {
    catchClassErrorMsg(notificationApi!, {
      message: 'Widget path is required',
    });
    return null;
  }

  return import(path)
    .then((module) => {
      const Entity = Object.values(module)[0] as new (arg0: IUser) => TWidget;

      if (typeof Entity !== 'function') {
        catchClassErrorMsg(notificationApi!, {
          message: 'Unable to load widget',
        });
        return null;
      }

      const widget = new Widget(Entity, user, path, {
        notificationApi: notificationApi!,
        intl,
      });

      return widget;
    })
    .catch((e) => {
      catchClassErrorMsg(notificationApi!, {
        message: e.message,
      });
      return null;
    });
};
