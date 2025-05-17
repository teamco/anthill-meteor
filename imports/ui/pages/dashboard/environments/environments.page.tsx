import { Meteor } from 'meteor/meteor';
import React, { JSX, useContext } from 'react';
import { Button, Table, TableProps } from 'antd';
import { useSubscribe } from 'meteor/react-meteor-data';
import { createFileRoute, useNavigate } from '@tanstack/react-router';

import { EnvironmentsCollection } from '/imports/collections/environments.collection';

import {
  ICommonDataType,
  IMetadata,
  IUser,
  TLayout,
  TStatus,
  TRouterTypes,
} from '/imports/config/types';
import { TMessageConfig } from '/imports/config/types/notification.type';

import { I18nContext } from '/imports/ui/context/i18n.context';
import { AbilityContext } from '../../../context/authentication.context';
import { NotificationContext } from '/imports/ui/context/notification.context';

import Page from '/imports/ui/components/Page/page.component';

import { useTable } from '/imports/ui/hooks/table.hook';

import { indexable } from '/imports/utils/table/table.util';
import { t } from '/imports/utils/i18n.util';

import {
  createEnvironment,
  deleteEnvironment,
} from '/imports/ui/services/environment.service';
import { getEntities } from '/imports/ui/services/shared.service';

import { metadataColumns } from './columns.metadata';

import { EnvironmentNew } from './environment/environment.new';

import { TEnvironmentTabs } from './environment/metadata/tabs.metadata';

import './environments.module.less';

export interface IDataType extends ICommonDataType {
  name: string;
  type: string;
  status: TStatus;
  metadata: IMetadata;
  layout: TLayout;
}

/**
 * EnvironmentsPage component
 *
 * This component renders a page displaying a table of environments fetched from the EnvironmentsCollection.
 * It uses Meteor's reactive data sources to subscribe to the environments publication and track
 * the environment data. The table displays columns defined in metadataColumns and uses the indexable
 * utility function to handle the data source. The page also includes a button to create a new environment,
 * which triggers the creation of an environment with a default layout and an empty widget. The new environment
 * is inserted into the EnvironmentsCollection using a Meteor method call.
 *
 * @returns {JSX.Element} The JSX element representing the environments page
 */
const EnvironmentsPage: React.FC = (): JSX.Element => {
  const isEnvironmentsLoading = useSubscribe('environments');
  const isLayoutsLoading = useSubscribe('layouts');
  const isWidgetsLoading = useSubscribe('widgets');

  const intl = useContext(I18nContext);
  const ability = useContext(AbilityContext);
  const { modalApi, notificationApi, messageApi } =
    useContext(NotificationContext);

  const navigate = useNavigate();

  const messageConfig: TMessageConfig = {
    notificationApi,
    messageApi,
    intl,
  };

  /**
   * isLoading
   *
   * A utility function that returns true if the data required for this component is still loading.
   *
   * @returns {boolean} true if either the environments, layouts, or widgets are still loading
   */
  const isLoading = (): boolean => {
    return isEnvironmentsLoading() || isLayoutsLoading() || isWidgetsLoading();
  };

  const user = Meteor.user() as IUser;

  /**
   * onDelete
   *
   * A callback function called when the delete button is clicked in the environments table.
   * It deletes the environment with the given id using the deleteEnvironment service function.
   *
   * @param {string} id - The id of the environment to delete
   */
  const onDelete = (id: string): void => {
    deleteEnvironment(id, handleRefresh, messageConfig);
  };

  /**
   * onEdit
   *
   * A callback function called when the edit button is clicked in the environments table.
   * It navigates to the environment edit page with the given id.
   *
   * @param {string} id - The id of the environment to edit
   */
  const onEdit = async (id: string): Promise<void> => {
    navigate({
      to: `${TRouterTypes.DASHBOARD_ENVIRONMENTS}/${id}#${TEnvironmentTabs.GENERAL}`,
    });
  };

  const {
    total,
    entities,
    tableParams: { pagination },
    filteredInfo,
    sortedInfo,
    handleRefresh,
    handleTableChange,
  } = useTable(
    'environmentsPaginate',
    getEntities,
    EnvironmentsCollection as any,
  );

  const columns: TableProps<IDataType>['columns'] = metadataColumns(
    intl,
    filteredInfo,
    sortedInfo,
    onDelete,
    onEdit,
    entities,
  );

  const tableProps = {
    columns,
    pagination,
    scroll: { x: 800 },
    bordered: true,
    className: 'gridList',
    dataSource: indexable(entities, pagination?.current, pagination?.pageSize),
    loading: isLoading(),
    rowKey: (record: IDataType) => record._id,
    onChange: handleTableChange,
    title: () => (
      <div className="gridHeader">
        <Button
          disabled={ability.cannot('create', 'environment')}
          loading={isLoading()}
          type={'primary'}
          onClick={handleCreateEnvironment}
        >
          Create Env
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
   * Opens a modal dialog to create a new environment.
   * The modal includes a form component (`EnvironmentNew`) which, upon submission,
   * triggers the creation of a new environment using the `createEnvironment` function.
   * The dialog is configured to be 600 pixels wide and displays a title indicating
   * the addition of a new environment.
   */
  const handleCreateEnvironment = () => {
    modalApi.info({
      width: 600,
      title: t(intl, 'actions.addNew', { type: t(intl, 'environment.title') }),
      content: (
        <EnvironmentNew
          disabled={isLoading()}
          onSave={(values) =>
            createEnvironment(values.name, user, handleRefresh, {
              description: values.description,
              ...messageConfig,
            })
          }
        />
      ),
      footer: null,
    });
  };

  return (
    <Page
      ableFor={{ subject: 'dashboard.environments' }}
      title={t(intl, 'dashboard.environments.title')}
      description={t(intl, 'dashboard.environments.description')}
    >
      <Table<IDataType> {...tableProps} />
    </Page>
  );
};

export const Route = createFileRoute(TRouterTypes.DASHBOARD_ENVIRONMENTS)({
  component: EnvironmentsPage,
});
