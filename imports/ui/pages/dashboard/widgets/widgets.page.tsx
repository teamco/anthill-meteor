import React, { JSX, useContext } from "react";
import { Button, Table } from 'antd';
import { useSubscribe } from "meteor/react-meteor-data";
import { TableProps } from "antd/lib/table";

import { WidgetsCollection } from "/imports/collections/widgets.collection";

import { CommonDataType, IMetadata, TLayout, TStatus } from "/imports/config/types";

import { I18nContext } from "/imports/ui/context/i18n.context";
import { AbilityContext } from '/imports/ui/context/authentication.context';
import { NotificationContext } from '/imports/ui/context/notification.context';

import Page from "/imports/ui/components/Page/page.component";

import { useTable } from "/imports/ui/hooks/table.hook";

import { t } from "/imports/utils/i18n.util";
import { indexable } from "/imports/utils/antd.util";
import { catchClassErrorMsg } from "/imports/utils/message.util";

import { createWidget, deleteWidget } from "/imports/ui/services/widget.service";

import { metadataColumns } from "./columns.metadata";

import { WidgetNew } from "./widget/widget.new";

import Widget from "/imports/api/environment/Widget";

import './widgets.module.less';

export interface DataType extends CommonDataType {
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
	const isLoading = useSubscribe("widgets");
	const intl = useContext(I18nContext);
	const ability = useContext(AbilityContext);
	const { modalApi } = useContext(NotificationContext);

	const user = Meteor.user();

	/**
	 * onDelete
	 *
	 * A callback function called when the delete button is clicked in the widgets table.
	 * It deletes the widget with the given id using the deleteWidget service function.
	 *
	 * @param {string} id - The id of the widget to delete
	 */
	const onDelete = (id: string): void => {
		deleteWidget(id, intl, handleRefresh);
	};

	const onEdit = (id: string): void => {
		debugger
	};

	const {
		total,
		entities,
		tableParams: { pagination },
		filteredInfo,
		sortedInfo,
		handleRefresh,
		handleTableChange
	} = useTable("widgetsPaginate", WidgetsCollection as any);

	const columns: TableProps<DataType>['columns'] = metadataColumns({ intl, filteredInfo, sortedInfo, onDelete, onEdit, entities });

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
		title: () => (
			<div className="gridHeader">
				<Button
					disabled={ability.cannot('create', 'widget')}
					loading={isLoading()}
					type={"primary"}
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
		)
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
					onSave={values => {
						import(`/${values.path}`).
							then(module => {
								const Entity = module[values.name];

								if (!Entity) {
									catchClassErrorMsg({ message: 'Widget name is invalid' });
								}

								const widget = new Widget(Entity, user);

								createWidget(widget, handleRefresh);

							}).catch(e => {
								catchClassErrorMsg({ message: 'Widget path is invalid' });
							})
					}}
				/>
			),
			footer: null
		})
	};

	return (
		<Page
			ableFor={{ subject: 'dashboard.widgets' }}
			title={t(intl, 'dashboard.widgets.title')}
			description={t(intl, 'dashboard.widgets.description')}
		>
			<Table<DataType> {...tableProps} />
		</Page>
	);
}

export default WidgetsPage;