import React, { JSX } from 'react';
import { createFileRoute, useRouterState } from '@tanstack/react-router';
import { useIntl } from 'react-intl';
import { ResultStatusType } from 'antd/es/result';

import ErrorPage from '/imports/ui/components/Page/Error/error.page.component';

import { t } from '/imports/utils/i18n.util';
import { TRouterTypes } from '/imports/config/types';

type TProps = {
  subject?: string;
};

const Page404: React.FC<TProps> = (props): JSX.Element => {
  const { subject = 'page404' } = props;

  const routerState = useRouterState();

  const intl = useIntl();

  return (
    <ErrorPage
      subTitle={t(intl, 'error.page404')}
      subject={subject}
      status={routerState.statusCode as ResultStatusType}
    />
  );
};

export const Route = createFileRoute(TRouterTypes.ERROR_404)({
  component: Page404,
});

export default Page404;
