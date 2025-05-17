import { FC, JSX } from 'react';
import {
  CaretUpOutlined,
  CaretDownOutlined,
  CaretLeftOutlined,
  CaretRightOutlined,
} from '@ant-design/icons';
import { Button } from 'antd';
import classnames from 'classnames';
import { ButtonProps } from 'antd/lib/button';

import { TAddPanelFn, TDirection } from '/imports/config/types';

import './buttons.module.less';

type TProps = {
  className?: string;
  onClick: TAddPanelFn;
  panelId: string;
};

type TBtn = {
  type: 'text' | 'link' | 'default' | 'primary' | 'dashed' | 'ghost';
  size: string;
} & ButtonProps;

/**
 * ArrowButtons is a component that renders four direction buttons to add an environment panel above, below, left or right to the current panel.
 * It accepts a className, an onClick handler and the id of the panel to which the new panel should be added.
 * The onClick handler is called with the direction and the panel id as arguments.
 * The component renders a div with two sub divs, each containing two buttons. The first button in the first div adds a panel above, the second one adds a panel below.
 * The first button in the second div adds a panel to the left, the second one adds a panel to the right.
 * The buttons are of type text and size small.
 * The component also logs the panelId to the console.
 */
export const ArrowButtons: FC<TProps> = (props): JSX.Element => {
  const { className, onClick, panelId } = props;

  const btnProps: TBtn = {
    type: 'text',
    size: 'small',
  };

  /**
   * handleAdd is a callback function that is called when one of the direction buttons is clicked.
   * It calls the onClick handler with the direction and the panelId as arguments.
   * @param direction The direction of the new panel
   */
  const handleAdd: (direction: TDirection) => void = (
    direction: TDirection,
  ): void => {
    onClick(direction, panelId);
  };

  return (
    <div className={classnames('addBtn', className)}>
      <div>
        <Button
          {...btnProps}
          icon={<CaretUpOutlined />}
          onClick={() => handleAdd('up')}
        />
        <Button
          {...btnProps}
          icon={<CaretDownOutlined />}
          onClick={() => handleAdd('down')}
        />
      </div>
      <div>
        <Button
          {...btnProps}
          icon={<CaretLeftOutlined />}
          onClick={() => handleAdd('left')}
        />
        <Button
          {...btnProps}
          icon={<CaretRightOutlined />}
          onClick={() => handleAdd('right')}
        />
      </div>
    </div>
  );
};
