import React, { JSX, memo } from 'react';
import classnames from 'classnames';

import { Can } from '/imports/ui/components/Ability/can';
import Loader from '/imports/ui/components/Loader/loader.component';
import {
  HelmetComponent,
  IHelmetProps,
} from '/imports/ui/components/Helmet/helmet.component';

import Page403 from '/imports/ui/pages/403';

import { EAbilityAction, TAbility } from '/imports/config/types';

import './page.module.less';

type TPageProps = {
  testId?: string;
  className?: string;
  title: string;
  description?: string;
  loading?: boolean;
  ableFor: TAbility;
  children?: React.ReactNode;
};

/**
 * @function Page
 * @param props.testId The id of the div container of the page (used in tests only)
 * @param props.className The class of the div container of the page
 * @param props.loading Whether or not the page should display a spinner
 * @param props.ableFor The ability of the page. If the user doesn't have enough permissions to access the page, the page will be redirected to the page403 page with the given status (default is 403).
 * @param props.title The title of the page
 * @param props.description The description of the page
 * @param props.children The children of the page
 * @returns {JSX.Element} The JSX element of the page
 */
const Page: React.FC<TPageProps> = (props: TPageProps): JSX.Element => {
  const {
    testId,
    className,
    loading = false,
    ableFor: { action = EAbilityAction.READ, subject },
    title,
    description,
    children,
  } = props;

  let descKey = description;

  if (description) {
    descKey = description.replace(/ /g, '_');
  }

  const helmetProps: IHelmetProps = {
    title,
    links: [],
    meta: [
      { name: 'description', content: description },
      {
        name: 'keywords',
        content: ['AntHill', title, descKey].join(','),
      },
      { name: 'og:description', content: description },
      { name: 'og:image', content: '/images/logo.png' },
      { name: 'twitter:description', content: description },
      { name: 'twitter:image', content: '/images/logo.png' },
    ],
  };

  return (
    <div className={classnames('page', className)} data-testid={testId}>
      <Can I={action} a={subject}>
        <HelmetComponent {...helmetProps} />
        <div>
          <Loader loading={!!loading} />
          <h1>{title}</h1>
          <h4>{description}</h4>
        </div>
        {loading ? 'Loading...' : <div>{children}</div>}
      </Can>
      <Page403 ableFor={props.ableFor} />
    </div>
  );
};

export default memo(Page);
