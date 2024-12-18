import React, { JSX, useContext } from "react";
import { Tabs, TabsProps } from 'antd';
import { useSubscribe, useTracker } from "meteor/react-meteor-data";
import { useParams } from "react-router-dom";

import { TEnvironmentEdit } from "/imports/config/types";

import { I18nContext } from "/imports/ui/context/i18n.context";
import { AbilityContext } from '/imports/ui/context/authentication.context';

import Page from "/imports/ui/components/Page/page.component";

import { t } from "/imports/utils/i18n.util";

import { getEnvironment } from "/imports/ui/services/environment.service";

import { useEnvironmentTabs } from "./metadata/tabs.metadata";

import '../environments.module.less';

export type TField = {
	name?: string;
	description?: string;
	status?: TEnvironmentEdit['status'];
};

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
	const isWidgetLoading = useSubscribe("widgets");

	/**
	 * isLoading
	 *
	 * A utility function that returns true if the data required for this component is still loading.
	 *
	 * @returns {boolean} true if either the environments or the layouts are still loading
	 */
	const isLoading = (): boolean => {
		return isEnvironmentLoading() ||
			isLayoutLoading() ||
			isWidgetLoading();
	};

	const intl = useContext(I18nContext);
	const ability = useContext(AbilityContext);

	const { environmentId } = useParams();

	const environment: TEnvironmentEdit = useTracker(() => getEnvironment(environmentId), [environmentId]);

	const itemTabs: TabsProps['items'] = useEnvironmentTabs(environment, isLoading())

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