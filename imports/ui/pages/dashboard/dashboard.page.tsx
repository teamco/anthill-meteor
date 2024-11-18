import { Button, Table } from "antd";
import type { TableProps } from 'antd';
import React, { useEffect, useState } from "react";
import { useTracker, useSubscribe } from "meteor/react-meteor-data";
import { EnvironmentsCollection } from "/imports/collections/environments.collection";
import Environment from "/imports/api/environment/Environment";
import { EmptyWidget } from "/imports/api/widgets/empty.widget";
import { IMetadata, TEnvironment, TLayout, TStatus } from "/imports/api/environment/types";
import { tsToLocaleDateTime } from "/imports/utils/timestamp";

interface DataType {
	key: string;
	name: string;
	type: string;
	status: TStatus;
	metadata: IMetadata;
	layout: TLayout;
}

const columns: TableProps<DataType>['columns'] = [
	{
    title: 'N',
    dataIndex: 'idx',
    rowScope: 'row',
  },
	{
		title: 'Name',
		dataIndex: 'name',
		key: 'name'
	},
	{
		title: 'Type',
		dataIndex: 'type',
		key: 'type'
	},
	{
		title: 'Status',
		dataIndex: 'status',
		key: 'status',
		render: (status: TStatus): JSX.Element => {
			return (
				<div>
					{status.isDraft && 'Draft'}
					{status.isActive && 'Active'}
					{status.isPending && 'Pending'}
				</div>
			)
		}
	},
	{
		title: 'Updated At',
		dataIndex: 'metadata',
		key: 'metadata',
		render: (metadata: IMetadata): JSX.Element => {
			return (
				<div>
					{tsToLocaleDateTime(metadata?.updatedAt.toString())}
				</div>
			)
		}
	},
];

const DashboardPage: React.FC = (): JSX.Element => {
	const isLoading = useSubscribe("environments");
	const envs: any = useTracker(() => EnvironmentsCollection.find({}).fetch());

	const user = Meteor.user() || { _id: '1' };

	const createEnvironment = () => {
		const env = new Environment('development', 'development', user);
		const layout = env.createLayout(user);
		
		layout.addWidget(new EmptyWidget(null, user));

		Meteor.callAsync("environmentsInsert", { ...env }).then((_id: string) => {			
			//fetchEnvironments();
		});
	};

	return (
		<div>
			<h1>Dashboard</h1>
			<Table<DataType> columns={columns} dataSource={envs.map((env: TEnvironment, idx: number) => ({ idx: idx + 1, key: env._id, ...env }))} />
			<Button loading={isLoading()} type={"primary"} onClick={createEnvironment}>Create Env</Button>
		</div>
	);
}

export default DashboardPage;