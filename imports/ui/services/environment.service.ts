import { Meteor } from 'meteor/meteor';

import Environment from '/imports/api/environment/Environment';
import Widget from '/imports/api/environment/Widget';

import { EmptyWidget } from '../../api/widgets/empty/empty.widget';
import { EnvironmentsCollection } from '/imports/collections/environments.collection';

import {
  IUser,
  TEnvironmentEdit,
  TWidget,
  TMessageConfig,
  TNotificationError,
  TLayout,
} from '/imports/config/types';

import { t, TIntl } from '/imports/utils/i18n.util';
import {
  successSaveMsg,
  catchErrorMsg,
  successDeleteMsg,
  catchWarnMsg,
  catchClassErrorMsg,
  successUpdateMsg,
} from '/imports/utils/message.util';

import { getWidgetBy } from './widget.service';
import { prepareToCreate } from './shared.service';
import { MessageInstance } from 'antd/es/message/interface';
import { NotificationInstance } from 'antd/es/notification/interface';

/**
 * Creates a new environment with a single empty widget.
 *
 * @param {string} name - The name of the environment
 * @param {IUser} user - The user creating the environment
 * @param {() => void} handleRefresh - Call after the environment is created
 * @param {Object} config - Configuration object containing message and
 * notification APIs and internationalization context
 * @param {string} [config.description] - The description of the environment
 * @returns {void}
 */
export const createEnvironment = (
  name: string,
  user: IUser,
  handleRefresh: () => void,
  config: {
    description?: string;
  } & TMessageConfig,
): void => {
  const env = new Environment(name, user, {
    description: config.description,
    notificationApi: config.notificationApi,
    intl: config.intl,
  });
  if (!user)
    return catchClassErrorMsg(config.notificationApi, {
      message: 'User is required',
    });

  const widget = getWidgetBy('resource', 'empty');

  if (!widget)
    return catchClassErrorMsg(config.notificationApi, {
      message: 'EmptyWidget is required',
    });

  const layout = env.createLayout(user);

  layout.addWidget({
    ...new Widget(
      EmptyWidget as unknown as new (arg0: IUser) => TWidget,
      user,
      {
        notificationApi: config.notificationApi,
        intl: config.intl,
      },
    ),
    _id: widget._id,
  });

  const _environment = prepareToCreate(env as TEnvironmentEdit);

  Meteor.callAsync('environmentInsert', { ..._environment })
    .then((_id: string) => {
      successSaveMsg(config.messageApi, config.intl, 'Environment');
      handleRefresh();

      const _layout = prepareToCreate(layout as TLayout);

      Meteor.callAsync('layoutInsert', {
        ..._layout,
        environmentId: _id,
      })
        .then((_id: string) => {
          successSaveMsg(config.messageApi, config.intl, 'Layout');
        })
        .catch((err: TNotificationError) => {
          catchErrorMsg(config.notificationApi, err);
        });
    })
    .catch((err: TNotificationError) => {
      catchErrorMsg(config.notificationApi, err);
    });
};

/**
 * Deletes an environment by its _id.
 *
 * This function makes an asynchronous call to remove the specified environment
 * from the collection. Upon successful deletion, a success message is displayed
 * and the handleRefresh function is called to update the UI. If the deletion
 * fails, a warning message is shown. Any errors during the process are caught
 * and handled.
 *
 * @param {string} _id - The unique identifier of the environment to delete.
 * @param {() => void} handleRefresh - Callback function to refresh the
 * environment list after deletion.
 * @param {TMessageConfig} config - Configuration object containing message and
 * notification APIs and internationalization context.
 * @returns {void}
 */
export const deleteEnvironment = (
  _id: string,
  handleRefresh: () => void,
  config: TMessageConfig,
): void => {
  Meteor.callAsync('environmentRemove', { _id })
    .then((res: number) => {
      if (res > 0) {
        successDeleteMsg(config.messageApi, config.intl, 'Environment');
        handleRefresh();
      } else {
        catchWarnMsg(config.notificationApi, {
          errorType: 'warning',
          message: t(config.intl as TIntl, 'error.warningMsg') as string,
          error: 'Error 400',
          name: '',
        });
      }
    })
    .catch((err: TNotificationError) => {
      catchErrorMsg(config.notificationApi, err);
    });
};

/**
 * Updates an environment by its _id.
 *
 * This function makes an asynchronous call to update the specified environment
 * in the collection. Upon successful update, a success message is displayed
 * and the handleRefresh function is called to update the UI.
 * If the update fails, a warning message is shown. Any errors during the
 * process are caught and handled.
 *
 * @param {string} _id - The unique identifier of the environment to update.
 * @param {Pick<TEnvironmentEdit, 'name' | 'description' | 'status'>} doc -
 * The environment document with changes.
 * @param {TMessageConfig} config - Configuration object containing message
 * and notification APIs and internationalization context.
 * @returns {void}
 */
export const updateEnvironment = (
  _id: string,
  doc: Pick<TEnvironmentEdit, 'name' | 'description' | 'status'>,
  config: Partial<TMessageConfig>,
): void => {
  Meteor.callAsync('environmentUpdate', { _id, doc })
    .then((res: number) => {
      if (res > 0) {
        successUpdateMsg(
          config.messageApi as MessageInstance,
          config.intl as TIntl,
          'Environment',
        );
      } else {
        catchWarnMsg(config.notificationApi as NotificationInstance, {
          errorType: 'warning',
          message: t(config.intl as TIntl, 'error.warningMsg') as string,
          error: 'Error 400',
          name: '',
        });
      }
    })
    .catch((err: TNotificationError) => {
      catchErrorMsg(config.notificationApi as NotificationInstance, err);
    });
};

/**
 * Get an environment by its _id
 *
 * @param {string} _id - The unique identifier of the environment to get.
 * @return {TEnvironmentEdit} - The environment object
 */
export const getEnvironment = (_id: string): TEnvironmentEdit =>
  EnvironmentsCollection.findOne({
    _id,
    'metadata.createdBy': Meteor.userId(),
  }) as TEnvironmentEdit;
