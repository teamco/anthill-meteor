import React, { memo, useEffect } from 'react';
import { Button, Result } from 'antd';
import classnames from 'classnames';
import { useNavigate } from 'react-router-dom';
import { stub } from '/imports/utils/functions';
import Loader from '/imports/ui/components/Loader/loader.component';
import { Can } from '/imports/ui/components/Ability/can';

type TErrorProps = {
  loading: boolean;
  errorModel: any;
  status: number;
  subject: string;
  className?: string;
  spinOn?: string[];
  title?: string;
  subTitle?: string;
  onQuery?: () => void;
};

/**
 * @export
 * @param props
 * @returns {JSX.Element}
 * @constructor
 */
const ErrorPage = (props: TErrorProps) => {
  const history = useNavigate();

  const {
    loading,
    errorModel,
    status,
    subject,
    className,
    spinOn = [],
    title = t(intl, 'error.warning'),
    subTitle = t(intl, 'error.warningMsg'),
    onQuery = stub
  } = props;

  const { errors = [] } = errorModel;

  const MODEL_NAME = 'errorModel';

  const { href } = window.location;
  const url = new URL(href);
  const referrer = url.searchParams.get('referrer');

  const extra = referrer ? (
      <Button type={'default'} onClick={() => history(referrer)}>
        {t(intl, 'actions.back')}
      </Button>
  ) : null;

  const _error = (
      <Can I={'read'} a={subject}>
        <Loader loading={loading}
                spinOn={[
                  `${MODEL_NAME}/query`,
                  `${MODEL_NAME}/saveError`,
                  ...spinOn
                ]}/>
        <div className={styles.errorFlexCenter}>
          <Result extra={extra}
                  status={status}
                  title={title}
                  subTitle={subTitle}
                  className={classnames(styles[subject], className)}/>
        </div>
      </Can>
  );

  // effectHook(() => {
  //   onQuery({ status, title });
  // });

  return _error;
};

export default memo(ErrorPage);