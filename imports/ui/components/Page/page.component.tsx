import React, { memo } from 'react';
import classnames from 'classnames';

import { Can } from '/imports/ui/components/Ability/can';
import Loader from '/imports/ui/components/Loader/loader.component';
import Page403 from '/imports/ui/pages/403';
import { TAbility } from '/imports/config/types';

import './page.module.less';

type TPageProps = {
  testId?: string,
  className?: string,
  spinning?: boolean,
  ableFor?: TAbility,
  children?: React.ReactNode
}

/**
 * @function Page
 * @param props.testId The id of the div container of the page (used in tests only)
 * @param props.className The class of the div container of the page
 * @param props.spinning Whether or not the page should display a spinner
 * @param props.ableFor The ability of the page. If the user doesn't have enough permissions to access the page, the page will be redirected to the page403 page with the given status (default is 403).
 * @param props.children The children of the page
 * @returns {JSX.Element} The JSX element of the page
 */
const Page: React.FC<TPageProps> = (props: TPageProps): JSX.Element => {
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

  return (    
    <div className={classnames('page', className)} data-testid={testId}>
      <Loader spinning={!!spinning} />
      <Can I={action} a={subject}>
        {children}
      </Can>
      <Page403 ableFor={props.ableFor}/>
    </div>
  );
}

export default memo(Page);