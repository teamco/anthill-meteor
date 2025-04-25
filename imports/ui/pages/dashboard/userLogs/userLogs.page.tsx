import React, { JSX, useContext } from "react";
import { Button, Table } from 'antd';
import { useSubscribe } from "meteor/react-meteor-data";
import { TableProps } from "antd/lib/table";

import { UserLogsCollection } from "/imports/collections/userLogs.collection";

import { ICommonDataType, IMetadata, TLayout, TStatus } from "/imports/config/types";

import { I18nContext } from "/imports/ui/context/i18n.context";
import { AbilityContext } from '/imports/ui/context/authentication.context';
import { NotificationContext } from '/imports/ui/context/notification.context';

import Page from "/imports/ui/components/Page/page.component";

import { useTable } from "/imports/ui/hooks/table.hook";

import { t } from "/imports/utils/i18n.util";
import { indexable } from "../../../../utils/table/table.util";

import { metadataColumns } from "./columns.metadata";

import './userLogs.module.less';

export interface IDataType extends ICommonDataType {
	name: string;
	type: string;
	status: TStatus;
	metadata: IMetadata;
	layout: TLayout;
}

/**
 * UserLogsPage component
 *
 * This component renders a page displaying a table of userLogs fetched from the UserLogsCollection.
 * It uses Meteor's reactive data sources to subscribe to the userLogs publication and track
 * the userLog data. The table displays columns defined in metadataColumns and uses the indexable
 * utility function to handle the data source. The page also includes a button to create a new userLog,
 * which triggers the creation of an userLog with a default layout and an empty userLog. The new userLog
 * is inserted into the UserLogsCollection using a Meteor method call.
 *
 * @returns {JSX.Element} The JSX element representing the userLogs page
 */
const UserLogsPage: React.FC = (): JSX.Element => {
	const isLoading = useSubscribe("userLogs");
	const intl = useContext(I18nContext);
	const ability = useContext(AbilityContext);
	const { modalApi } = useContext(NotificationContext);

	const user = Meteor.user();

	const {
		total,
		entities,
		tableParams: { pagination },
		filteredInfo,
		sortedInfo,
		handleRefresh,
		handleTableChange
	} = useTable("userLogsPaginate", UserLogsCollection as any);

	const columns: TableProps<IDataType>['columns'] = metadataColumns({ intl, filteredInfo, sortedInfo, entities });

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
					disabled={ability.cannot('create', 'userLog')}
					loading={isLoading()}
					type={"primary"}
					// onClick={handleCreateUserLog}
				>
					Export UserLog
				</Button>
			</div>
		),
		footer: () => (
			<div className="gridFooter">
				{t(intl, 'table.total', { amount: total.toString() })}
			</div>
		)
	};

	return (
		<Page
			ableFor={{ subject: 'dashboard.userLogs' }}
			title={t(intl, 'dashboard.userLogs.title')}
			description={t(intl, 'dashboard.userLogs.description')}
		>
			<Table<IDataType> {...tableProps} />
		</Page>
	);
}

export default UserLogsPage;