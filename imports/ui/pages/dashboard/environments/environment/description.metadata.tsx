import React from "react";
import { DescriptionsItemType, DescriptionsProps } from "antd/es/descriptions";
import { Input, Segmented } from "antd";
import { PauseCircleTwoTone, PlayCircleTwoTone } from "@ant-design/icons";

import { TEnvironmentEdit } from "/imports/config/types";

import { t, TIntl } from "/imports/utils/i18n.util";
import { placeholderField } from "/imports/utils/form.util";
import { COLORS } from "/imports/utils/colors.util";
import { tsToLocaleDateTime } from "/imports/utils/timestamp.util";

const { TextArea } = Input;

/**
 * DescriptionMetadata is a component that takes an environment and generates a description form based on its properties.
 * It returns an array of items that can be used in a <Descriptions> component.
 *
 * @param {TIntl} intl - An instance of TIntl for translation
 * @param {TEnvironment} environment - An environment object
 * @returns {DescriptionsProps['items']} - An array of items that can be used in a <Descriptions> component
 */
export const DescriptionMetadata = (intl: TIntl, environment: TEnvironmentEdit): DescriptionsItemType[] => {
  const descriptionMsg = t(intl, 'form.description', { entity: '' });

  const inputProps = {
		disabled: false,
		autoComplete: 'off',
		autofill: 'off'
	};
  
  const items: DescriptionsProps['items'] = [
		{
			key: 'description',
			label: descriptionMsg,
			span: 'filled',
			children: (
				<TextArea
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
					defaultValue={Object.keys(environment?.status || {}).find(s => environment?.status[s])}
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

	return items;
}