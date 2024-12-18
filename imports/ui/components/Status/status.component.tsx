import React, { JSX } from "react";
import { Tag } from "antd";
import { CheckCircleOutlined, PauseCircleOutlined } from "@ant-design/icons";

import { COLORS } from "/imports/utils/colors.util";
import { t, TIntl } from "/imports/utils/i18n.util";

type TStatusProps = {
  intl: TIntl;
  status: {
    isDraft: boolean;
    isActive: boolean;
  }
}

/**
 * StatusComponent displays a status tag with a color and label based on the status props.
 * 
 * @component
 * @param {TStatusProps} props - The properties for the component.
 * @param {TIntl} props.intl - The internationalization object for translations.
 * @param {Object} props.status - An object representing the status of an item.
 * @param {boolean} props.status.isDraft - Indicates if the status is draft.
 * @param {boolean} props.status.isActive - Indicates if the status is active.
 * @returns {JSX.Element} A JSX element representing the status tag.
 */
export const StatusComponent: React.FC<TStatusProps> = (props: TStatusProps): JSX.Element => {
  const { intl, status: { isActive = false } } = props;

  let color = COLORS.tags.processing;
  let label = t(intl, 'environment.status.draft');
  let icon = <PauseCircleOutlined />

  if (isActive) {
    color = COLORS.tags.success;
    label = t(intl, 'environment.status.active');
    icon = <CheckCircleOutlined />
  }

  return <Tag icon={icon} color={color}>{label}</Tag>
}
