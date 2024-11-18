import React, { memo } from 'react';

import { Can } from '@/utils/auth/can';

import ErrorPage from '@/components/Page/Error';

function page403(props = {}): JSX.Element {
  const { ableFor = {} } = props;
  const { status = 403, action = 'read', subject = 'page403' } = ableFor;

  const page = (
      <ErrorPage title={status}
                 subject={'page403'}
                 status={status}/>
  );

  const isRedirect = subject === 'page403';

  return isRedirect ? page : (
      <Can not I={action} a={subject}>{page}</Can>
  );
}

export default memo(page403);
