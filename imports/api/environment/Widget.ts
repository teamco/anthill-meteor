import { NotificationInstance } from 'antd/es/notification/interface';
import {
  TWidget,
  IMetadata,
  TWidgetContent,
  IUser,
  TWidgetTags,
  EStatus,
  TWidgetConfig,
} from '/imports/config/types';
import { TMessageConfig } from '/imports/config/types/notification.type';

import CommonUtils from '/imports/utils/common.util';
import { catchClassErrorMsg } from '/imports/utils/message.util';
import { TIntl } from '/imports/utils/i18n.util';

/**
 * Represents a Widget entity with properties and methods for managing widget data.
 * Extends CommonUtils and implements the TWidget interface.
 *
 * @property {string} [_id] - Optional unique identifier for the widget.
 * @property {string} name - The name of the widget.
 * @property {string} description - A brief description of the widget.
 * @property {string} thumbnail - URL or path to the widget's thumbnail image.
 * @property {{ width: number; height: number; }} dimensions - The dimensions of the widget.
 * @property {TWidgetContent} content - The content associated with the widget.
 * @property {string} category - The category to which the widget belongs.
 * @property {string} resource - The resource identifier for the widget.
 * @property {IMetadata} metadata - Metadata containing creation and update information.
 *
 * @constructor
 * @param {TWidget} widget - The widget data to initialize the instance.
 *
 * @method create - Initializes the widget properties with the provided data.
 * @param {TWidget} widget - The widget data to set.
 */
export default class Widget extends CommonUtils implements TWidget {
  _id?: string;
  name: string;
  description: string;
  thumbnail: string;
  dimensions: { width: number; height: number };
  content: TWidgetContent;
  category: string;
  resource: string;
  tags: TWidgetTags;
  config: TWidgetConfig;
  metadata: IMetadata = {
    createdAt: new Date(),
    updatedAt: new Date(),
    createdBy: '',
    updatedBy: '',
  };

  readonly notificationApi: NotificationInstance;
  readonly intl: TIntl;

  constructor(
    Widget: new (arg0: IUser) => TWidget,
    user: IUser,
    config: Pick<TMessageConfig, 'notificationApi' | 'intl'>,
  ) {
    super();

    this.notificationApi = config.notificationApi;
    this.intl = config.intl;

    this.create(Widget, user);
  }

  create(Widget: new (arg0: IUser) => TWidget, user: IUser): void {
    if (!user)
      return catchClassErrorMsg(this.notificationApi, {
        message: 'User is required',
      });
    if (!Widget)
      return catchClassErrorMsg(this.notificationApi, {
        message: 'Widget is required',
      });

    const widget: TWidget = new Widget(user);

    this.name = widget.name;
    this.description = widget.description;
    this.thumbnail = widget.thumbnail;
    this.dimensions = widget.dimensions;
    this.content = widget.content;
    this.category = widget.category;
    this.resource = widget.resource;
    this.metadata = widget.metadata;
    this.tags = widget.tags;
    this.config = widget.config;
  }
}
