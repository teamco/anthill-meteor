import { JSX, memo, useContext } from 'react';
import { Button, Result } from 'antd';
import { ResultStatusType } from 'antd/es/result';
import classnames from 'classnames';
import { useNavigate } from '@tanstack/react-router';

import Loader from '/imports/ui/components/Loader/loader.component';
import { Can } from '/imports/ui/components/Ability/can';

import { t } from '/imports/utils/i18n.util';
import { I18nContext } from '/imports/ui/context/i18n.context';

type TErrorProps = {
  loading?: boolean;
  status: ResultStatusType;
  subject: string;
  className?: string;
  title?: string;
  subTitle?: string;
  onQuery?: () => void;
};

/**
 * @function ErrorPage
 * @description The page will display an error message and a button to go back to the previous page.
 * @param {TErrorProps} props The props of the component.
 * @returns {JSX.Element} The JSX element of the page.
 * @example
 * <ErrorPage status={'warning'} subject={'pageWarning'} />
 */
const ErrorPage = (props: TErrorProps): JSX.Element => {
  const navigate = useNavigate();
  const intl = useContext(I18nContext);

  const {
    status,
    subject,
    className,
    loading = false,
    title = t(intl, 'error.warning'),
    subTitle = t(intl, 'error.warningMsg'),
  } = props;

  const { href } = window.location;
  const url = new URL(href);
  const referrer = url.searchParams.get('referrer');

  const extra = referrer ? (
    <Button type={'default'} onClick={() => navigate({ to: referrer })}>
      {t(intl, 'actions.back')}
    </Button>
  ) : null;

  const _error = (
    <Can I={'read'} a={subject}>
      <Loader loading={loading} />
      <div>
        <Result
          extra={extra}
          status={status}
          title={title}
          subTitle={subTitle}
          className={classnames(subject, className)}
        />
      </div>
    </Can>
  );

  return _error;
};

export default memo(ErrorPage);
