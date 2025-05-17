import React, { JSX, useContext } from 'react';
import { Button, Table } from 'antd';
import { useSubscribe } from 'meteor/react-meteor-data';
import { TableProps } from 'antd/lib/table';
import { createFileRoute } from '@tanstack/react-router';

import { WidgetsCollection } from '/imports/collections/widgets.collection';

import {
  ICommonDataType,
  IMetadata,
  IUser,
  TLayout,
  TRouterTypes,
  TStatus,
  TWidget,
} from '/imports/config/types';
import { TMessageConfig } from '/imports/config/types/notification.type';

import { I18nContext } from '/imports/ui/context/i18n.context';
import { AbilityContext } from '../../../context/authentication.context';
import { NotificationContext } from '/imports/ui/context/notification.context';

import Page from '/imports/ui/components/Page/page.component';

import { useTable } from '/imports/ui/hooks/table.hook';

import { t } from '/imports/utils/i18n.util';
import { indexable } from '/imports/utils/table/table.util';
import { catchClassErrorMsg } from '/imports/utils/message.util';

import {
  createWidget,
  deleteWidget,
} from '/imports/ui/services/widget.service';
import { getEntities } from '/imports/ui/services/shared.service';

import { metadataColumns } from './columns.metadata';

import { WidgetNew } from './widget/widget.new';

import Widget from '/imports/api/environment/Widget';

import './widgets.module.less';

export interface IDataType extends ICommonDataType {
  name: string;
  type: string;
  status: TStatus;
  metadata: IMetadata;
  layout: TLayout;
}

/**
 * WidgetsPage component
 *
 * This component renders a page displaying a table of widgets fetched from the WidgetsCollection.
 * It uses Meteor's reactive data sources to subscribe to the widgets publication and track
 * the widget data. The table displays columns defined in metadataColumns and uses the indexable
 * utility function to handle the data source. The page also includes a button to create a new widget,
 * which triggers the creation of an widget with a default layout and an empty widget. The new widget
 * is inserted into the WidgetsCollection using a Meteor method call.
 *
 * @returns {JSX.Element} The JSX element representing the widgets page
 */
const WidgetsPage: React.FC = (): JSX.Element => {
  const isLoading = useSubscribe('widgets');
  const intl = useContext(I18nContext);
  const ability = useContext(AbilityContext);
  const { modalApi, notificationApi, messageApi } =
    useContext(NotificationContext);

  const user = Meteor.user();

  const messageConfig: TMessageConfig = {
    notificationApi,
    messageApi,
    intl,
  };

  /**
   * onDelete
   *
   * A callback function called when the delete button is clicked in the widgets table.
   * It deletes the widget with the given id using the deleteWidget service function.
   *
   * @param {string} id - The id of the widget to delete
   */
  const onDelete = (id: string): void => {
    deleteWidget(id, handleRefresh, messageConfig);
  };

  const onEdit = (id: string): void => {
    debugger;
  };

  const {
    total,
    entities,
    tableParams: { pagination },
    filteredInfo,
    sortedInfo,
    handleRefresh,
    handleTableChange,
  } = useTable('widgetsPaginate', getEntities, WidgetsCollection as any);

  const columns: TableProps<IDataType>['columns'] = metadataColumns({
    intl,
    filteredInfo,
    sortedInfo,
    onDelete,
    onEdit,
    entities,
  });

  const tableProps = {
    columns,
    pagination,
    scroll: { x: 1000 },
    bordered: true,
    className: 'gridList',
    dataSource: indexable(entities, pagination?.current, pagination?.pageSize),
    loading: isLoading(),
    rowKey: (record: IDataType) => record._id,
    onChange: handleTableChange,
    title: () => (
      <div className="gridHeader">
        <Button
          disabled={ability.cannot('create', 'widget')}
          loading={isLoading()}
          type={'primary'}
          onClick={handleCreateWidget}
        >
          Create Widget
        </Button>
      </div>
    ),
    footer: () => (
      <div className="gridFooter">
        {t(intl, 'table.total', { amount: total.toString() })}
      </div>
    ),
  };

  /**
   * Opens a modal dialog to create a new widget.
   * The modal includes a form component (`WidgetNew`) which, upon submission,
   * triggers the creation of a new widget using the `createWidget` function.
   * The dialog is configured to be 600 pixels wide and displays a title indicating
   * the addition of a new widget.
   */
  const handleCreateWidget = () => {
    modalApi.info({
      width: 600,
      title: t(intl, 'actions.addNew', { type: t(intl, 'widget.title') }),
      content: (
        <WidgetNew
          disabled={isLoading()}
          onSave={(values) => {
            import(values.path)
              .then((module) => {
                const Entity = Object.values(module)[0] as new (
                  arg0: IUser,
                ) => TWidget;

                if (typeof Entity !== 'function') {
                  catchClassErrorMsg(notificationApi, {
                    message: 'Unable to load widget',
                  });
                }

                const widget = new Widget(Entity, user, {
                  notificationApi,
                  intl,
                });

                createWidget(widget, handleRefresh, messageConfig);
              })
              .catch((e) => {
                catchClassErrorMsg(notificationApi, {
                  message: e.message,
                });
              });
          }}
        />
      ),
      footer: null,
    });
  };

  return (
    <Page
      ableFor={{ subject: 'dashboard.widgets' }}
      title={t(intl, 'dashboard.widgets.title')}
      description={t(intl, 'dashboard.widgets.description')}
    >
      <Table<IDataType> {...tableProps} />
    </Page>
  );
};

export const Route = createFileRoute(TRouterTypes.DASHBOARD_WIDGETS)({
  component: WidgetsPage,
});
