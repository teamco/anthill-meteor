import React from "react";
import { CaretUpOutlined, CaretDownOutlined, CaretLeftOutlined, CaretRightOutlined } from "@ant-design/icons";
import { Button } from "antd";
import classnames from "classnames";

import "./buttons.module.less";

export const ArrowButtons = (props) => {
  const { className, onClick, panelId } = props;

  const btnProps = {
    type: "text",
    size: "small"
  }

  const handleAdd = (direction) => {
    onClick(direction, panelId);
  }
console.debug('panelId', panelId);
  return (
    <div className={classnames('addBtn', className)}>
      <div>
        <Button {...btnProps} icon={<CaretUpOutlined />} onClick={() => handleAdd('up')} />
        <Button {...btnProps} icon={<CaretDownOutlined />} onClick={() => handleAdd('down')} />
      </div>
      <div>
        <Button {...btnProps} icon={<CaretLeftOutlined />} onClick={() => handleAdd('left')} />
        <Button {...btnProps} icon={<CaretRightOutlined />} onClick={() => handleAdd('right')} />
      </div>
    </div>
  );
};