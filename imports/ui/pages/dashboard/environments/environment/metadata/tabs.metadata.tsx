import React, { useContext, useState } from 'react';
import { Button, Descriptions, Form, FormProps, Table } from 'antd';
import {
  AppstoreAddOutlined,
  BlockOutlined,
  FormOutlined,
} from '@ant-design/icons';
import { TabsProps } from 'antd/lib/tabs';
import { ColumnsType, TableProps } from 'antd/es/table';
import { useParams } from '@tanstack/react-router';

import { t } from '/imports/utils/i18n.util';
import { onFinishFailed, onValidate } from '/imports/utils/form.util';
import { indexable } from '/imports/utils/table/table.util';
import { TUseTable, useTable } from '/imports/ui/hooks/table.hook';

import { updateEnvironment } from '/imports/ui/services/environment.service';
import { getEntities } from '/imports/ui/services/shared.service';

import { TEnvironment, TEnvironmentEdit } from '/imports/config/types';

import { WidgetsCollection } from '/imports/collections/widgets.collection';
import { LayoutsCollection } from '/imports/collections/layouts.collection';

import { AbilityContext } from '../../../../../context/authentication.context';
import { I18nContext } from '/imports/ui/context/i18n.context';

import { DescriptionMetadata } from './description.metadata';
import { metadataColumns as layoutsMetadataColumns } from './columns.metadata';
import { metadataColumns as widgetsMetadataColumns } from '/imports/ui/pages/dashboard/widgets/columns.metadata';

import { TField } from '../environment.edit';
import { IDataType } from '../../environments.page';

export enum TEnvironmentTabs {
  GENERAL = 'general',
  LAYOUTS = 'layouts',
  WIDGETS = 'widgets',
}

/**
 * @function useEnvironmentTabs
 * @description A hook that returns an array of TabsProps['items'] based on the environment and isLoading state.
 * It uses the useParams hook to get the environmentId from the URL parameters.
 * It uses the useContext hook to get the I18nContext and AbilityContext.
 * It uses the useState hook to store the environment name, canUpdate flag, and status object.
 * It uses the onFinish function to handle the successful form submission.
 * It uses the onFieldsChange function to handle form field changes and set a flag to trigger an update on the next form submission.
 * It uses the onLayoutDelete function to handle the delete button click in the layouts table.
 * It uses the tableProps function to generate a props object for the antd Table component.
 * It uses the useTable hook to get the layouts and widgets data.
 * @param {TEnvironmentEdit} environment - The environment data
 * @param {() => boolean} loading - A function that returns the loading state
 * @returns {TabsProps['items']}
 */
export const useEnvironmentTabs = (
  environment: TEnvironmentEdit,
  loading: boolean,
): TabsProps['items'] => {
  const { environmentId } = useParams({ strict: false });
  const [form] = Form.useForm();

  const intl = useContext(I18nContext);
  const ability = useContext(AbilityContext);

  const [envName, setEnvName] = useState<string>('');
  const [canUpdate, setUpdate] = useState<boolean>(false);
  const [status, setStatus] = useState<TEnvironment['status']>({
    isActive: false,
    isDraft: false,
  });

  const _canUpdate = ability.can('update', environmentId) && canUpdate;

  /**
   * @function onFinish
   * @description Handles the successful form submission
   * @param {TField} values - The form values
   * @example
   * <EnvironmentNew onSave={(values) => console.log(values)} />
   */
  const onFinish: FormProps<TField>['onFinish'] = (values: TField): void => {
    const { name, description } = values;
    const data: Pick<TEnvironmentEdit, 'name' | 'description' | 'status'> = {
      name,
      description,
      status,
    };

    updateEnvironment(environmentId, data, intl);
    setUpdate(false);
  };

  /**
   * @function onFieldsChange
   * @description Handles form field changes and sets a flag to trigger an update on the next form submission.
   */
  const onFieldsChange = (): void => {
    setUpdate(true);
  };

  const layouts: TUseTable = useTable(
    'layoutsPaginate',
    getEntities,
    LayoutsCollection as any,
  );
  const widgets: TUseTable = useTable(
    'widgetsPaginate',
    getEntities,
    WidgetsCollection as any,
    {},
  );

  /**
   * onDelete
   *
   * A callback function called when the delete button is clicked in the environments table.
   * It deletes the environment with the given id using the deleteEnvironment service function.
   *
   * @param {string} id - The id of the environment to delete
   */
  const onLayoutDelete = (id: string): void => {
    // deleteEnvironment(id, intl, handleRefresh);
  };

  /**
   * @function tableProps
   * @description A utility function that returns a props object for the antd Table component.
   * It takes in a context object, metadata function, and an optional scrollX value.
   * It returns a props object that includes the columns, pagination, scroll, bordered, className, loading, rowKey, dataSource, onChange, and footer properties.
   * @param {TUseTable} ctx - The context object returned by the useTable hook
   * @param {any} metadata - A function that returns an array of column definitions
   * @param {number} [scrollX=800] - The horizontal scroll value
   * @param onDelete
   * @returns {TableProps<any>}
   */
  const tableProps = (
    ctx: TUseTable,
    metadata: any,
    scrollX: number,
    onDelete?: (id: string) => void,
  ): TableProps<any> => {
    const {
      entities,
      sortedInfo,
      filteredInfo,
      total,
      tableParams: { pagination },
      handleTableChange,
    } = ctx;

    const columns: TableProps<any>['columns'] = metadata({
      intl,
      sortedInfo,
      filteredInfo,
      entities,
      onDelete,
    });

    return {
      loading,
      columns,
      pagination,
      scroll: { x: scrollX },
      bordered: true,
      className: 'gridList',
      rowKey: (record: IDataType) => record._id,
      dataSource: indexable(
        entities,
        pagination?.current,
        pagination?.pageSize,
      ),
      onChange: handleTableChange,
      footer: () => (
        <div className="gridFooter">
          {t(intl, 'table.total', { amount: total.toString() })}
        </div>
      ),
    };
  };

  const layoutsTableProps = {
    ...tableProps(
      layouts,
      layoutsMetadataColumns as unknown as ColumnsType<any>,
      800,
      onLayoutDelete,
    ),
  };

  const rowSelection: TableProps<IDataType>['rowSelection'] = {
    onChange: (selectedRowKeys: React.Key[], selectedRows: IDataType[]) => {
      console.log(
        `selectedRowKeys: ${selectedRowKeys}`,
        'selectedRows: ',
        selectedRows,
      );
    },
    getCheckboxProps: (record: IDataType) => ({
      disabled: ability.cannot('assign', record._id),
      name: record.name,
    }),
  };

  const widgetsTableProps = {
    ...tableProps(
      widgets,
      widgetsMetadataColumns as unknown as ColumnsType<any>,
      1000,
    ),
  };

  const itemTabs: TabsProps['items'] = [
    {
      key: TEnvironmentTabs.GENERAL,
      icon: <FormOutlined />,
      label: t(intl, 'environment.tabs.general'),
      disabled: ability.cannot(
        `access.${TEnvironmentTabs.GENERAL}`,
        environmentId,
      ),
      children: (
        <Form
          layout={'vertical'}
          autoComplete={'off'}
          form={form}
          disabled={ability.cannot('update', environmentId)}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          onFieldsChange={onFieldsChange}
          initialValues={{
            name: environment?.name,
            description: environment?.description,
            status: Object.keys(environment?.status || {}).find(
              (s) => environment?.status[s],
            ),
          }}
        >
          <Descriptions
            className="description"
            size={'small'}
            bordered
            title={envName || environment?.name}
            items={DescriptionMetadata(
              intl,
              environment,
              setEnvName,
              setStatus,
            )}
            extra={
              <Button
                onClick={(e) => onValidate(e, form)}
                disabled={!_canUpdate}
                loading={loading}
                type="primary"
              >
                {t(intl, 'actions.update')}
              </Button>
            }
          />
        </Form>
      ),
    },
    {
      key: TEnvironmentTabs.LAYOUTS,
      icon: <BlockOutlined />,
      label: t(intl, 'environment.tabs.layouts'),
      disabled: ability.cannot(
        `access.${TEnvironmentTabs.LAYOUTS}`,
        environmentId,
      ),
      children: (
        <div className="layouts">
          <h3>{t(intl, 'environment.list.layouts')}</h3>
          <Table<any> {...layoutsTableProps} />
        </div>
      ),
    },
    {
      key: TEnvironmentTabs.WIDGETS,
      icon: <AppstoreAddOutlined />,
      label: t(intl, 'environment.tabs.widgets'),
      disabled: ability.cannot(
        `access.${TEnvironmentTabs.WIDGETS}`,
        environmentId,
      ),
      children: (
        <div className="widgets">
          <h3>{t(intl, 'environment.list.widgets')}</h3>
          <Table<any>
            {...widgetsTableProps}
            rowSelection={{ type: 'checkbox', ...rowSelection }}
          />
        </div>
      ),
    },
  ];

  return itemTabs;
};
