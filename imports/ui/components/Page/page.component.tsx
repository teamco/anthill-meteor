import React, { memo, useContext } from 'react';

// import Page403 from '@/pages/403';

import Loader from '/imports/ui/components/Loader/loader.component';

import { TAbility } from '/imports/config/types';
import { useOutletContext } from 'react-router-dom';

type TPageProps = {
  testId?: string,
  className?: string,
  spinning?: boolean,
  ableFor?: TAbility,
  children?: React.ReactNode
}

function Page(props: TPageProps) {
  const {
    testId,
    className,
    spinning = false,
    ableFor: {
      action = 'read',
      subject
    },
    children
  } = props;

  const ability = useOutletContext();

  return (
    
    <div className={className} data-testid={testId}>
      <Loader spinning={!!spinning} />
      {ability.can(action, subject) ? children : null}
      {/* <Page403 ableFor={props.ableFor}/> */}
    </div>
  );
}

export default memo(Page);