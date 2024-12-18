import React, { JSX } from "react";
import { Card } from "antd";
import classnames from 'classnames';

import './tile.module.less';

type TTileActions = React.ReactNode[];

type TTileProps = {
  title: string;
  description?: string;
  className?: string;
  bordered?: boolean;
  isLoading?: boolean;
  hoverable?: boolean;
  actions?: TTileActions;
  onClick?: () => void;
};

export const TileComponent: React.FC<TTileProps> = (props): JSX.Element => {
  const {
    title,
    description,
    className,
    actions = [],
    isLoading = false,
    bordered = true,
    hoverable = true,
    onClick
  } = props;

  return (
    <Card actions={actions}
      onClick={onClick} 
      loading={isLoading}
      hoverable={hoverable}
      bordered={bordered}
      className={classnames('tile', className)}>
      <Card.Meta title={title} description={description} />
    </Card>
  );
};