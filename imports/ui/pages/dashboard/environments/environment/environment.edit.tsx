import React, { JSX, useContext, useEffect, useState } from 'react';
import { Tabs, TabsProps } from 'antd';
import { useSubscribe, useTracker } from 'meteor/react-meteor-data';
import {
  createFileRoute,
  useLocation,
  useNavigate,
  useParams,
} from '@tanstack/react-router';

import { TEnvironmentEdit, TRouterTypes } from '/imports/config/types';

import { I18nContext } from '/imports/ui/context/i18n.context';
import { AbilityContext } from '../../../../context/authentication.context';

import Page from '/imports/ui/components/Page/page.component';

import { t } from '/imports/utils/i18n.util';

import { getEnvironment } from '/imports/ui/services/environment.service';

import { TEnvironmentTabs, useEnvironmentTabs } from './metadata/tabs.metadata';

import '../environments.module.less';

export type TField = {
  name?: string;
  description?: string;
  status?: TEnvironmentEdit['status'];
};

const DEFAULT_TAB = TEnvironmentTabs.GENERAL;

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
  const isEnvironmentLoading = useSubscribe('environments');
  const isLayoutLoading = useSubscribe('layouts');
  const isWidgetLoading = useSubscribe('widgets');

  const [activeKey, setActiveKey] = useState<string>(DEFAULT_TAB);

  const navigate = useNavigate();
  const { hash } = useLocation();

  useEffect(() => {
    setActiveKey(hash ? hash : DEFAULT_TAB);
  }, [hash]);

  /**
   * isLoading
   *
   * A utility function that returns true if the data required for this component is still loading.
   *
   * @returns {boolean} true if either the environments or the layouts are still loading
   */
  const isLoading = (): boolean => {
    return isEnvironmentLoading() || isLayoutLoading() || isWidgetLoading();
  };

  const intl = useContext(I18nContext);
  const ability = useContext(AbilityContext);

  const { environmentId } = useParams({ strict: false });

  const environment: TEnvironmentEdit = useTracker(
    () => getEnvironment(environmentId),
    [environmentId],
  );

  const itemTabs: TabsProps['items'] = useEnvironmentTabs(
    environment,
    isLoading(),
  );

  return (
    <Page
      ableFor={{ subject: environmentId }}
      loading={isLoading()}
      title={t(intl, 'actions.edit', { type: t(intl, 'environment.title') })}
    >
      <Tabs
        className="envTabs"
        type="card"
        activeKey={activeKey}
        items={itemTabs}
        onChange={(key: string) => {
          setActiveKey(key ? key : DEFAULT_TAB);
          navigate({ to: `#${key}` });
        }}
      />
    </Page>
  );
};

export const Route = createFileRoute(TRouterTypes.DASHBOARD_ENVIRONMENT_EDIT)({
  component: EnvironmentEdit,
});
