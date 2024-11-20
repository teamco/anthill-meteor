import React from "react";
import { Button, Table } from "antd";
import { useTracker, useSubscribe } from "meteor/react-meteor-data";

import Environment from "/imports/api/environment/Environment";
import { EnvironmentsCollection } from "/imports/collections/environments.collection";
import { EmptyWidget } from "/imports/api/widgets/empty.widget";

import { CommonDataType, IMetadata, TLayout, TStatus } from "/imports/config/types";

import Page from "/imports/ui/components/Page/page.component";

import { indexable } from "/imports/utils/antd.utils";

import { metadataColumns } from "./columns.metadata";

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
	const envs = useTracker(() => EnvironmentsCollection.find({}).fetch());

	const user = Meteor.user() || { _id: '1' };

	const createEnvironment = () => {
		const env = new Environment('development', 'development', user);
		const layout = env.createLayout(user);

		layout.addWidget(new EmptyWidget(null, user));

		Meteor.callAsync("environmentsInsert", { ...env }).then((_id: string) => {
			//fetchEnvironments();
		});
	};

	const columns = metadataColumns();

	return (
		<Page ableFor={{ subject: 'environments' }}>
			<Table<DataType> columns={columns} dataSource={indexable(envs)} />
			<Button loading={isLoading()} type={"primary"} onClick={createEnvironment}>Create Env</Button>
		</Page>
	);
}

export default EnvironmentsPage;