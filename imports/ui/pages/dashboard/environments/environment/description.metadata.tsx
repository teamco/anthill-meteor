import React from "react";
import { DescriptionsItemType, DescriptionsProps } from "antd/es/descriptions";
import { Form, Input, Segmented } from "antd";
import { PauseCircleTwoTone, PlayCircleTwoTone } from "@ant-design/icons";

import { TEnvironment, TEnvironmentEdit, TStatus } from "/imports/config/types";

import { t, TIntl } from "/imports/utils/i18n.util";
import { placeholderField, requiredField, TFieldRule } from "/imports/utils/form.util";
import { COLORS } from "/imports/utils/colors.util";
import { tsToLocaleDateTime } from "/imports/utils/timestamp.util";

import { TField } from "./environment.edit";

const { TextArea } = Input;

/**
 * DescriptionMetadata is a component that takes an environment and generates a description form based on its properties.
 * It returns an array of items that can be used in a <Descriptions> component.
 *
 * @param {TIntl} intl - An instance of TIntl for translation
 * @param {TEnvironment} environment - An environment object
 * @param {function} setEnvName - A function to set the name
 * @returns {DescriptionsProps['items']} - An array of items that can be used in a <Descriptions> component
 */
export const DescriptionMetadata = (intl: TIntl, environment: TEnvironmentEdit, setEnvName: (name: string) => void, setStatus: (status: TEnvironmentEdit['status']) => void): DescriptionsItemType[] => {
	const nameMsg = t(intl, 'form.name', { entity: '' });
	const descriptionMsg = t(intl, 'form.description', { entity: '' });

	const nameRule: TFieldRule = requiredField(intl, nameMsg);

	const inputProps = {
		disabled: false,
		autoComplete: 'off',
		autofill: 'off'
	};

	const items: DescriptionsProps['items'] = [
		{
			key: 'name',
			label: nameMsg,
			span: 'filled',
			children: (
				<Form.Item<TField> name="name" rules={[nameRule]} style={{ marginBottom: 0 }}>
					<Input
						onChange={e => setEnvName(e.target.value)}
						{...inputProps}
						placeholder={placeholderField(intl, nameMsg, 'actions.enter')} />
				</Form.Item>
			),
		},
		{
			key: 'description',
			label: descriptionMsg,
			span: 'filled',
			children: (
				<Form.Item<TField> noStyle name="description">
					<TextArea
						showCount
						{...inputProps}
						maxLength={400}
						placeholder={placeholderField(intl, descriptionMsg, 'actions.enter')}
						style={{ maxHeight: 250, height: 100, marginBottom: 30 }}
					/>
				</Form.Item>
			)
		},
		{
			key: 'envStatus',
			span: 'filled',
			label: t(intl, 'environment.list.status'),
			children: (
				<Form.Item<TField> noStyle name="status">
					<Segmented<string>
						onChange={name => {
							setStatus({
								isActive: name === 'isActive',
								isDraft: name === 'isDraft'
							});
						}}
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
					/>
				</Form.Item>
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

	return items;
}