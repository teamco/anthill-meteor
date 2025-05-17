import { JSX } from 'react';
import { Spin } from 'antd';

type TLoaderProps = {
  testId?: string;
  wrapperClassName?: string;
  loading?: boolean;
};

const Loader = (props: TLoaderProps): JSX.Element => {
  const { testId, wrapperClassName, loading = false } = props;

  return (
    <div data-testid={testId}>
      <Spin wrapperClassName={wrapperClassName} spinning={loading} />
    </div>
  );
};

export default Loader;
