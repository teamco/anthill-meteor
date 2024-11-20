import React, { useContext } from "react";
import { Button, Table } from 'antd';
import { useTracker, useSubscribe } from "meteor/react-meteor-data";

import Environment from "/imports/api/environment/Environment";
import { EnvironmentsCollection } from "/imports/collections/environments.collection";
import { EmptyWidget } from "/imports/api/widgets/empty.widget";

import { CommonDataType, IMetadata, TLayout, TStatus } from "/imports/config/types";

import { I18nContext } from "/imports/ui/context/i18n.context";

import Page from "/imports/ui/components/Page/page.component";

import { useTable } from "/imports/ui/hooks/table.hook";

import { t } from "/imports/utils/i18n.util";
import { indexable } from "/imports/utils/antd.util";
import { catchMsg, successSaveMsg } from "/imports/utils/message.util";

import { metadataColumns } from "./columns.metadata";

import './environments.module.less';

export interface DataType extends CommonDataType {
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
	const isLoading = useSubscribe("environments");
	const intl = useContext(I18nContext);

	const total = useTracker(() => EnvironmentsCollection.find({}).count());

	const user = Meteor.user() || { _id: '1' };

	/**
	 * Create a new environment using the default type and layout.
	 *
	 * The new environment is created with the 'development' type and a default layout
	 * containing an empty widget. The environment is then inserted into the
	 * EnvironmentsCollection using a Meteor method call.
	 */
	const createEnvironment = () => {
		const env = new Environment('development', 'development', user);
		const layout = env.createLayout(user);

		layout.addWidget(new EmptyWidget(null, user));

		Meteor.callAsync("environmentsInsert", { ...env }).then(successSaveMsg).catch(catchMsg);
	};

	const { entities, tableParams, handleTableChange } = useTable("environmentsPaginate", total);

	const columns = metadataColumns();

	const tableProps = {
		columns,
		className: 'eList',
		dataSource: indexable(entities, tableParams.pagination?.current, tableParams.pagination?.pageSize),
		loading: isLoading(),
		rowKey: (record: DataType) => record._id,
		pagination: tableParams.pagination,
		onChange: handleTableChange,
		title: () => (
			<div className="eHooter">
				<Button loading={isLoading()} type={"primary"} onClick={createEnvironment}>Create Env</Button>
			</div>
		),
		footer: () => (
			<div className="eFooter">
				{t(intl, 'table.total', { amount: total.toString() })}
			</div>
		)
	};

	return (
		<Page
			ableFor={{ subject: 'dashboard.environments' }}
			title={t(intl, 'dashboard.environments.title')}
			description={t(intl, 'dashboard.environments.description')}
		>
			<Table<DataType> {...tableProps} />
		</Page>
	);
}

export default EnvironmentsPage;