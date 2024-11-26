import React, { useContext, useState } from "react";
import { Button, Descriptions, Form, FormProps, Table, Tabs, TabsProps } from 'antd';
import { AppstoreAddOutlined, BlockOutlined, FormOutlined } from "@ant-design/icons";
import { useSubscribe, useTracker } from "meteor/react-meteor-data";
import { ColumnsType, TableProps } from "antd/lib/table";
import { useParams } from "react-router-dom";

import { TEnvironment, TEnvironmentEdit } from "/imports/config/types";

import { I18nContext } from "/imports/ui/context/i18n.context";
import { AbilityContext } from '/imports/ui/context/authentication.context';

import { LayoutsCollection } from "/imports/collections/layouts.collection";
import { WidgetsCollection } from "/imports/collections/widgets.collection";

import Page from "/imports/ui/components/Page/page.component";

import { TUseTable, useTable } from "/imports/ui/hooks/table.hook";

import { t } from "/imports/utils/i18n.util";
import { indexable } from "/imports/utils/antd.util";
import { onFinishFailed, onValidate } from "/imports/utils/form.util";

import { getEnvironment, updateEnvironment } from "/imports/ui/services/environment.service";

import { DataType } from "../environments.page";
import { metadataColumns as layoutsMetadataColumns } from "./columns.metadata";
import { metadataColumns as widgetsMetadataColumns } from "/imports/ui/pages/dashboard/widgets/columns.metadata";
import { DescriptionMetadata } from "./description.metadata";

import '../environments.module.less';

export type TField = {
	name?: string;
	description?: string;
	status?: TEnvironmentEdit['status'];
};

/**
 * EnvironmentEdit component
 *
 * This component renders a page displaying information about a specific environment
 * and a table of layouts associated with the environment. It uses Meteor's reactive
 * data sources to subscribe to the environments and layouts publications and track the
 * data. The component also includes a button to create a new layout, which is currently
 * not implemented.
 *
 * @returns {JSX.Element} The JSX element representing the environments page
 */
const EnvironmentEdit: React.FC = (): JSX.Element => {
	const [form] = Form.useForm();

	const isEnvironmentLoading = useSubscribe("environments");
	const isLayoutLoading = useSubscribe("layouts");
	const isWidgetLoading = useSubscribe("widgets");

	const [envName, setEnvName] = useState<string>('');
	const [canUpdate, setUpdate] = useState<boolean>(false);
	const [status, setStatus] = useState<TEnvironment['status']>({
		isActive: false,
		isDraft: false,
	});

	/**
	 * isLoading
	 *
	 * A utility function that returns true if the data required for this component is still loading.
	 *
	 * @returns {boolean} true if either the environments or the layouts are still loading
	 */
	const isLoading = (): boolean => {
		return isEnvironmentLoading() ||
			isLayoutLoading() ||
			isWidgetLoading();
	};

	const intl = useContext(I18nContext);
	const ability = useContext(AbilityContext);

	const { environmentId } = useParams();

	const environment: TEnvironmentEdit = useTracker(() => getEnvironment(environmentId), [environmentId]);

	const user = Meteor.user() || { _id: '1' };

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
		const data: Pick<TEnvironmentEdit, 'name' | 'description' | 'status'> = { name, description, status };

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

	const layouts: TUseTable = useTable("layoutsPaginate", LayoutsCollection as any);
	const widgets: TUseTable = useTable("widgetsPaginate", WidgetsCollection as any);

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
	 * @param {TMetadata} metadata - A function that returns an array of column definitions
	 * @param {number} [scrollX=800] - The horizontal scroll value
	 * @returns {TableProps<any>}
	 */
	const tableProps = (ctx: TUseTable, metadata: any, scrollX: number, onDelete?: (id: string) => void): TableProps<any> => {
		const {
			entities,
			sortedInfo,
			filteredInfo,
			total,
			tableParams: { pagination },
			handleTableChange
		} = ctx;

		const columns: TableProps<any>['columns'] = metadata({
			intl,
			sortedInfo,
			filteredInfo,
			entities,
			onDelete,
		});

		return {
			columns,
			pagination,
			scroll: { x: scrollX },
			bordered: true,
			className: 'gridList',
			loading: isLoading(),
			rowKey: (record: DataType) => record._id,
			dataSource: indexable(entities, pagination?.current, pagination?.pageSize),
			onChange: handleTableChange,
			footer: () => (
				<div className="gridFooter">
					{t(intl, 'table.total', { amount: total.toString() })}
				</div>
			)
		}
	}

	const layoutsTableProps = {
		...tableProps(layouts, layoutsMetadataColumns as unknown as ColumnsType<any>, 800, onLayoutDelete),
	};

	const rowSelection: TableProps<DataType>['rowSelection'] = {
		onChange: (selectedRowKeys: React.Key[], selectedRows: DataType[]) => {
			console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
		},
		getCheckboxProps: (record: DataType) => ({
			disabled: ability.cannot('assign', record._id),
			name: record.name,
		}),
	};

	const widgetsTableProps = {
		...tableProps(widgets, widgetsMetadataColumns as unknown as ColumnsType<any>, 1000)
	};

	const itemTabs: TabsProps['items'] = [
		{
			key: 'general',
			icon: <FormOutlined />,
			label: t(intl, 'environment.tabs.general'),
			children: (
				<Form
					layout={"vertical"}
					autoComplete={"off"}
					form={form}
					onFinish={onFinish}
					onFinishFailed={onFinishFailed}
					onFieldsChange={onFieldsChange}
					initialValues={{
						name: environment?.name,
						description: environment?.description,
						status: Object.keys(environment?.status || {}).find(s => environment?.status[s])
					}}
				>
					<Descriptions
						className="description"
						size={'small'}
						bordered
						title={envName || environment?.name}
						items={DescriptionMetadata(intl, environment, setEnvName, setStatus)}
						extra={(
							<Button
								onClick={e => onValidate(e, form)}
								disabled={!_canUpdate}
								loading={isLoading()}
								type="primary"
							>
								{t(intl, 'actions.update')}
							</Button>
						)}
					/>
				</Form>
			),
		},
		{
			key: 'layouts',
			icon: <BlockOutlined />,
			label: t(intl, 'environment.tabs.layouts'),
			children: (
				<div className="layouts">
					<h3>{t(intl, 'environment.list.layouts')}</h3>
					<Table<any> {...layoutsTableProps} />
				</div>
			),
		},
		{
			key: 'widgets',
			icon: <AppstoreAddOutlined />,
			label: t(intl, 'environment.tabs.widgets'),
			children: (
				<div className="widgets">
					<h3>{t(intl, 'environment.list.widgets')}</h3>
					<Table<any> {...widgetsTableProps} rowSelection={{ type: 'checkbox', ...rowSelection }} />
				</div>
			),
		},
	]

	return (
		<Page
			ableFor={{ subject: environmentId }}
			loading={isLoading()}
			title={t(intl, 'actions.edit', { type: t(intl, 'environment.title') })}
		>
			<Tabs className="envTabs" type="card" defaultActiveKey="general" items={itemTabs} />
		</Page>
	);
}

export default EnvironmentEdit;