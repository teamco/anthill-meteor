import React, { memo, useContext, useEffect } from 'react';
import { Button, Result } from 'antd';
import classnames from 'classnames';
import { useNavigate } from 'react-router-dom';
import Loader from '/imports/ui/components/Loader/loader.component';
import { Can } from '/imports/ui/components/Ability/can';
import { t } from '../../../../utils/i18n.util';
import { I18nContext } from '/imports/ui/context/i18n.context';
import { ResultStatusType } from 'antd/es/result';

type TErrorProps = {
  spinning?: boolean;
  status: ResultStatusType;
  subject: string;
  className?: string;
  title?: string;
  subTitle?: string;
  onQuery?: () => void;
};

const ErrorPage = (props: TErrorProps): JSX.Element => {
  const history = useNavigate();
  const intl = useContext(I18nContext);

  const {
    spinning = false,
    status,
    subject,
    className,
    title = t(intl, 'error.warning'),
    subTitle = t(intl, 'error.warningMsg')
  } = props;


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
        <Loader spinning={spinning}/>
        <div>
          <Result extra={extra}
                  status={status}
                  title={title}
                  subTitle={subTitle}
                  className={classnames(subject, className)}/>
        </div>
      </Can>
  );

  return _error;
};

export default memo(ErrorPage);