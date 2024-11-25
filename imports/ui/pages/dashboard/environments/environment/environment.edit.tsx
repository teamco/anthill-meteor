import React, { useContext } from "react";
import { Button, Descriptions, Table, Tabs, TabsProps } from 'antd';
import { AppstoreAddOutlined, BlockOutlined, FormOutlined } from "@ant-design/icons";
import { useSubscribe, useTracker } from "meteor/react-meteor-data";
import { TableProps } from "antd/lib/table";
import { useParams } from "react-router-dom";

import { TEnvironmentEdit } from "/imports/config/types";

import { I18nContext } from "/imports/ui/context/i18n.context";
import { AbilityContext } from '/imports/ui/context/authentication.context';

import { LayoutsCollection } from "/imports/collections/layouts.collection";

import Page from "/imports/ui/components/Page/page.component";

import { useTable } from "/imports/ui/hooks/table.hook";

import { t } from "/imports/utils/i18n.util";
import { indexable } from "/imports/utils/antd.util";

import { getEnvironment } from "/imports/ui/services/environment.service";

import { DataType } from "../environments.page";
import { metadataColumns } from "./columns.metadata";
import { DescriptionMetadata } from "./description.metadata";

import '../environments.module.less';

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
	const isEnvironmentLoading = useSubscribe("environments");
	const isLayoutLoading = useSubscribe("layouts");

	/**
	 * isLoading
	 *
	 * A utility function that returns true if the data required for this component is still loading.
	 *
	 * @returns {boolean} true if either the environments or the layouts are still loading
	 */
	const isLoading = (): boolean => {
		return isEnvironmentLoading() || isLayoutLoading();
	};

	const intl = useContext(I18nContext);
	const ability = useContext(AbilityContext);
	const { environmentId } = useParams();

	const environment: TEnvironmentEdit = useTracker(() => getEnvironment(environmentId));

	const user = Meteor.user() || { _id: '1' };

	/**
	 * onDelete
	 *
	 * A callback function called when the delete button is clicked in the environments table.
	 * It deletes the environment with the given id using the deleteEnvironment service function.
	 *
	 * @param {string} id - The id of the environment to delete
	 */
	const onDelete = (id: string): void => {
		// deleteEnvironment(id, intl, handleRefresh);
	};
	const onEdit = (id: string): void => {
		// deleteEnvironment(id, intl, handleRefresh);
	};

	const {
		total,
		entities,
		tableParams: { pagination },
		filteredInfo,
		sortedInfo,
		handleRefresh,
		handleTableChange
	} = useTable("layoutsPaginate", LayoutsCollection as any);

	const columns: TableProps<DataType>['columns'] = metadataColumns(intl, filteredInfo, sortedInfo, onDelete, onEdit, entities);

	const tableProps = {
		columns,
		pagination,
		scroll: { x: 800 },
		bordered: true,
		className: 'gridList',
		dataSource: indexable(entities, pagination?.current, pagination?.pageSize),
		loading: isLoading(),
		rowKey: (record: DataType) => record._id,
		onChange: handleTableChange,
		footer: () => (
			<div className="gridFooter">
				{t(intl, 'table.total', { amount: total.toString() })}
			</div>
		)
	};

	const itemTabs: TabsProps['items'] = [
		{
			key: 'general',
			icon: <FormOutlined />,
			label: t(intl, 'environment.tabs.general'),
			children: (
				<Descriptions
					className="description"
					size={'small'}
					bordered
					title={environment?.name}
					items={DescriptionMetadata(intl, environment)}
					extra={(
						<Button
							disabled={true}
							loading={isLoading()}
							type="primary"
						>
							{t(intl, 'actions.update')}
						</Button>
					)}
				/>
			),
		},
		{
			key: 'layouts',
			icon: <BlockOutlined />,
			label: t(intl, 'environment.tabs.layouts'),
			children: (
				<div className="layouts">
					<h3>{t(intl, 'environment.list.layouts')}</h3>
					<Table<DataType> {...tableProps} />
				</div>
			),
		},
		{
			key: 'widgets',
			icon: <AppstoreAddOutlined />,
			label: t(intl, 'environment.tabs.widgets'),
			children: 'Content of Tab Pane 3',
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