import React, { memo } from 'react';
import { ResultStatusType } from 'antd/es/result';

import { Can } from '/imports/ui/components/Ability/can';
import ErrorPage from '/imports/ui/components/Page/Error/error.page.component';

type TProps = {
  status?: ResultStatusType;
  ableFor?: {
    action?: string;
    subject?: string;
  }
}

/**
 * Page403 component is a special page that is used to display an error page when user doesn't have enough permissions to access a page.
 * If the user doesn't have enough permissions to access the page, the page will be displayed.
 * Otherwise, the page will be redirected to the page403 page with the given status (default is 403).
 * @param props Component props
 * @param props.status The status of the error page (default is 403)
 * @param props.ableFor The ability of the user to access the page (default is { action: 'read', subject: 'page403' })
 * @returns {JSX.Element} The JSX element of the page
 */
const page403: React.FC<TProps> = (props: TProps): JSX.Element => {
  const { ableFor = {}, status = 403 } = props;
  const { action = 'read', subject = 'page403' } = ableFor;

  const page = (
    <ErrorPage title={status.toString()}
      subject={'page403'}
      status={status} />
  );

  const isRedirect = subject === 'page403';

  return isRedirect ? page : (
    <Can not I={action} a={subject}>{page}</Can>
  );
}

export default memo(page403);
