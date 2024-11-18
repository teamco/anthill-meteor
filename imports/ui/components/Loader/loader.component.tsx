import React from 'react';
import { Spin } from 'antd';

type TLoaderProps = {
  testId?: string,
  wrapperClassName?: string,
  spinning?: boolean,
}

const Loader = (props: TLoaderProps): JSX.Element => {

  const {
    testId,
    wrapperClassName,
    spinning = false,
  } = props;

  return (
      <div data-testid={testId}>
        <Spin wrapperClassName={wrapperClassName}
              spinning={spinning}/>
      </div>
  );
};

export default Loader;
