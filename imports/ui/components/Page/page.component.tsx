import React, { memo, useContext } from 'react';

// import Page403 from '@/pages/403';

import Loader from '/imports/ui/components/Loader/loader.component';

import { TAbility } from '/imports/config/types';
import { AbilityContext } from '/imports/ui/context/authentication.context';
import { Can } from '/imports/ui/components/Ability/can';

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

  const ability = useContext(AbilityContext);

  return (
    
    <div className={className} data-testid={testId}>
      <Loader spinning={!!spinning} />
      <Can I={action} a={subject}>
        {children}
      </Can>
      {/* <Page403 ableFor={props.ableFor}/> */}
    </div>
  );
}

export default memo(Page);