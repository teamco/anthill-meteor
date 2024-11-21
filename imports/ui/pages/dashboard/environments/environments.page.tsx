import React, { useContext } from "react";
import { Button, Table } from 'antd';
import { useSubscribe } from "meteor/react-meteor-data";

import { EnvironmentsCollection } from "/imports/collections/environments.collection";

import { CommonDataType, IMetadata, TLayout, TStatus } from "/imports/config/types";

import { I18nContext } from "/imports/ui/context/i18n.context";
import { AbilityContext } from '/imports/ui/context/authentication.context';
import { NotificationContext } from '/imports/ui/context/notification.context';

import Page from "/imports/ui/components/Page/page.component";

import { useTable } from "/imports/ui/hooks/table.hook";

import { t } from "/imports/utils/i18n.util";
import { indexable } from "/imports/utils/antd.util";

import { createEnvironment } from "/imports/ui/services/environment.service";

import { metadataColumns } from "./columns.metadata";

import './environments.module.less';
import { EnvironmentNew } from "./environment/environment.new";

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
	const ability = useContext(AbilityContext);
	const { modalApi } = useContext(NotificationContext);

	const user = Meteor.user() || { _id: '1' };

	const {
		total,
		entities,
		tableParams: { pagination },
		handleRefresh,
		handleTableChange
	} = useTable("environmentsPaginate", EnvironmentsCollection as any);

	const columns = metadataColumns();

	const tableProps = {
		columns,
		pagination,
		className: 'eList',
		dataSource: indexable(entities, pagination?.current, pagination?.pageSize),
		loading: isLoading(),
		rowKey: (record: DataType) => record._id,
		onChange: handleTableChange,
		title: () => (
			<div className="eHeader">
				<Button
					disabled={ability.cannot('create', 'environment')}
					loading={isLoading()}
					type={"primary"}
					onClick={handleCreateEnvironment}
				>
					Create Env
				</Button>
			</div>
		),
		footer: () => (
			<div className="eFooter">
				{t(intl, 'table.total', { amount: total.toString() })}
			</div>
		)
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
			title: t(intl, 'actions.addNew', { type: t(intl, 'dashboard.environment.title') }),
			content: (
				<EnvironmentNew
					disabled={isLoading()}
					onSave={values => createEnvironment(values.name, values.type, user, handleRefresh)}
				/>
			),
			footer: null
		})
	}

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