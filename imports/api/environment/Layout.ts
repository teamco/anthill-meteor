import { NotificationInstance } from 'antd/es/notification/interface';
import {
  IMetadata,
  IUser,
  TLayout,
  TLayoutWidget,
  TTemplate,
  TWidget,
  TMessageConfig,
} from '/imports/config/types';

import CommonUtils from '/imports/utils/common.util';
import { catchClassErrorMsg } from '/imports/utils/message.util';
import { TIntl } from '/imports/utils/i18n.util';

/**
 * Represents a layout that manages a collection of widgets and their metadata.
 * Extends CommonUtils and implements TLayout interface.
 *
 * @property {TTemplate} template - The template associated with the layout.
 * @property {number} version - The version number of the layout.
 * @property {TLayoutWidget} widgets - An array of widgets contained in the
 * layout.
 * @property {IMetadata} metadata - Metadata information including creation
 * and update details.
 *
 * @constructor
 * @param {IUser} user - The user responsible for creating the layout.
 *
 * @method create - Initializes the layout with a template, version, and user
 * metadata.
 * @param {TTemplate} template - The template to initialize the layout with.
 * @param {number} version - The version number to set for the layout.
 * @param {IUser} [user] - The user responsible for the creation of the layout.
 *
 * @method addWidget - Adds a widget to the layout.
 * @param {TWidget} widget - The widget to be added.
 *
 * @method removeWidget - Removes a widget from the layout.
 * @param {TWidget} widget - The widget to be removed.
 */
export default class Layout extends CommonUtils implements TLayout {
  template: TTemplate = [];
  version: number = 1;
  current: boolean = false;
  widgets: TLayoutWidget = {};
  metadata: IMetadata = {
    createdAt: new Date(),
    updatedAt: new Date(),
    createdBy: '',
    updatedBy: '',
  };

  readonly notificationApi: NotificationInstance;
  readonly intl: TIntl;

  constructor(
    user: IUser,
    config: Pick<TMessageConfig, 'notificationApi' | 'intl'>,
  ) {
    super();

    this.notificationApi = config.notificationApi;
    this.intl = config.intl;

    this.create([], 1, user);
  }

  create(template: TTemplate, version: number, user: IUser): void {
    if (!user)
      return catchClassErrorMsg(this.notificationApi, {
        message: 'User is required',
      });

    this.template = template;
    this.version = version;
    this.widgets = {};
    this.metadata = {
      ...this.metadata,
      createdBy: user?._id,
      updatedBy: user?._id,
    };
  }

  addWidget(widget: TWidget): void {
    if (!widget?._id)
      return catchClassErrorMsg(this.notificationApi, {
        message: 'Widget is required',
      });

    this.widgets[this.getObjectId()] = widget;
  }

  removeWidget(widget: TWidget): void {
    if (!widget)
      return catchClassErrorMsg(this.notificationApi, {
        message: 'Widget is required',
      });

    // this.widgets = this.widgets.filter((w) => w._id !== widget._id);
  }
}
