import React, { SetStateAction, useContext, useEffect, useState } from "react";
import { Button, Descriptions, DescriptionsProps, Input, Segmented, Table } from 'antd';
import { useSubscribe, useTracker } from "meteor/react-meteor-data";
import { TableProps } from "antd/lib/table";
import { useParams } from "react-router-dom";

import { EnvironmentsCollection } from "/imports/collections/environments.collection";

import { CommonDataType, IMetadata, TEnvironment, TEnvironmentEdit, TLayout, TStatus } from "/imports/config/types";

import { I18nContext } from "/imports/ui/context/i18n.context";
import { AbilityContext } from '/imports/ui/context/authentication.context';
import { NotificationContext } from '/imports/ui/context/notification.context';

import Page from "/imports/ui/components/Page/page.component";

import { useTable } from "/imports/ui/hooks/table.hook";

import { t } from "/imports/utils/i18n.util";
import { indexable } from "/imports/utils/antd.util";

import { createEnvironment, deleteEnvironment, getEnvironment } from "/imports/ui/services/environment.service";

import '../environments.module.less';
import { tsToLocaleDateTime } from "/imports/utils/timestamp.util";
import { placeholderField } from "/imports/utils/form.util";
import { EditOutlined, EditTwoTone, PauseCircleTwoTone, PlayCircleTwoTone } from '@ant-design/icons';
import { COLORS } from "/imports/utils/colors.util";

const EnvironmentEdit: React.FC = (): JSX.Element => {
	const isLoading = useSubscribe("environments");
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

	// const tableProps = {
	// 	columns,
	// 	pagination,
	// 	scroll: { x: 800 },
	// 	bordered: true,
	// 	className: 'gridList',
	// 	dataSource: indexable(entities, pagination?.current, pagination?.pageSize),
	// 	loading: isLoading(),
	// 	rowKey: (record: DataType) => record._id,
	// 	onChange: handleTableChange,
	// 	title: () => (
	// 		<div className="gridHeader">
	// 			<Button
	// 				disabled={ability.cannot('create', 'environment')}
	// 				loading={isLoading()}
	// 				type={"primary"}
	// 				onClick={handleCreateEnvironment}
	// 			>
	// 				Create Env
	// 			</Button>
	// 		</div>
	// 	),
	// 	footer: () => (
	// 		<div className="gridFooter">
	// 			{t(intl, 'table.total', { amount: total.toString() })}
	// 		</div>
	// 	)
	// };

	// /**
	//  * Opens a modal dialog to create a new environment.
	//  * The modal includes a form component (`EnvironmentNew`) which, upon submission,
	//  * triggers the creation of a new environment using the `createEnvironment` function.
	//  * The dialog is configured to be 600 pixels wide and displays a title indicating
	//  * the addition of a new environment.
	//  */
	// 	const handleCreateEnvironment = () => {
	// 		modalApi.info({
	// 			width: 600,
	// 			title: t(intl, 'actions.addNew', { type: t(intl, 'environment.title') }),
	// 			content: (
	// 				<EnvironmentNew
	// 					disabled={isLoading()}
	// 					onSave={values => createEnvironment(values.name, values.type, user, handleRefresh, { description: values.description })}
	// 				/>
	// 			),
	// 			footer: null
	// 		})
	// 	}

	const inputProps = {
		disabled: false,
		autoComplete: 'off',
		autofill: 'off'
	};

	const descriptionMsg = t(intl, 'form.description', { entity: '' });

	const items: DescriptionsProps['items'] = [
		{
			key: 'description',
			label: descriptionMsg,
			span: 'filled',
			children: (
				<Input.TextArea
					showCount
					{...inputProps}
					maxLength={400}
					value={environment?.description}
					placeholder={placeholderField(intl, descriptionMsg, 'actions.enter')}
					style={{ maxHeight: 250, height: 100, marginBottom: 30 }}
				/>
			)
		},
		{
			key: 'type',
			label: t(intl, 'environment.list.type'),
			children: environment?.type,
		},
		{
			key: 'status',
			span: 'filled',
			label: t(intl, 'environment.list.status'),
			children: (
				<Segmented<string>
					options={[
						{
							label: (
								<div className={'statusItem'}>
									<PauseCircleTwoTone twoToneColor={COLORS.danger} />
									<div>{t(intl, 'environment.status.draft')}</div>
								</div>
							),
							value: 'isDraft',
						},
						{
							label: (
								<div className={'statusItem'}>
									<PlayCircleTwoTone twoToneColor={COLORS.success} />
									<div>{t(intl, 'environment.status.active')}</div>
								</div>
							),
							value: 'isActive',
						}				
					]}
					defaultValue={Object.keys(environment?.status).find(s => environment?.status[s])}
					onChange={(value) => {
						console.log(value); // string
					}}
				/>
			),
		},
		{
			key: 'createdAt',
			label: t(intl, 'message.info.createdAt'),
			children: tsToLocaleDateTime(environment?.metadata.createdAt.toString()),
		},
		{
			key: 'updatedAt',
			span: 'filled',
			label: t(intl, 'message.info.updatedAt'),
			children: tsToLocaleDateTime(environment?.metadata.updatedAt.toString()),
		},
		{
			key: 'createdBy',
			label: t(intl, 'message.info.createdBy'),
			children: environment?.metadata.createdBy,
		},
		{
			key: 'updatedBy',
			span: 'filled',
			label: t(intl, 'message.info.updatedBy'),
			children: environment?.metadata.updatedBy,
		},
	];

	return (
		<Page
			ableFor={{ subject: environmentId }}
			loading={isLoading()}
			title={t(intl, 'actions.edit', { type: t(intl, 'environment.title') })}
		>
			<Descriptions
				size={'small'}
				bordered
				title={environment?.name}
				items={items}
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

		</Page>
	);
}

export default EnvironmentEdit;