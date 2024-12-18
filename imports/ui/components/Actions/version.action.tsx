import React, { JSX, useContext } from 'react';
import { Button } from 'antd';
import { EyeTwoTone } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

import { Can } from '/imports/ui/components/Ability/can';

import { I18nContext } from '/imports/ui/context/i18n.context';

import { t } from '/imports/utils/i18n.util';
import { COLORS } from '/imports/utils/colors.util';

type TVersionAction = {
  version: string;
  entityId: string;
  type?: 'primary' | 'dashed' | 'text';
  showLabel?: boolean;
  isLoading?: boolean;
  disabled?: boolean;
};

/**
 * @function VersionAction
 * @description A component that renders an edit button for the given `entityId`.
 * The button is disabled if the user doesn't have enough permissions to preview the given `entityId`.
 * The button is also disabled if the component is in a loading state.
 * @param props The props for the component
 * @param props.entityId The entityId of the entity to be previewed
 * @param props.version The version of the entity to be previewed
 * @param props.type The type of a button
 * @param props.showLabel Whether or not the component should show a label
 * @param props.isLoading Whether or not the component should be in a loading state
 * @param props.disabled Whether or not the component should be disabled
 * @returns {JSX.Element} The JSX element of the component
 */
export const VersionAction: React.FC<TVersionAction> = (props): JSX.Element => {
  const intl = useContext(I18nContext);
  const history = useNavigate();

  const {
    version,
    entityId,
    type = 'primary',
    showLabel = false,
    isLoading = false,
    disabled = false
  } = props;

  const { pathname } = window.location;

  /**
   * @function aClick
   * @description Prevents the default link behavior and stops the event propagation.
   * This is useful when we want to handle the click event manually.
   * @param {React.MouseEvent<HTMLAnchorElement, MouseEvent>} e The event object
   * @returns {void}
   */
  const aClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>): void => {
    e.preventDefault();

    history(`${pathname}/version/${version}`);
  };

  return (
    <Can I={'preview'} a={entityId}>
      <a title={t(intl, 'actions.version', { type: '' })}
        onClick={aClick}
        href={`${pathname}/version/${version}`}
        rel="noopener noreferrer"
      >
        <Button disabled={disabled}
          loading={isLoading}
          type={type}
          icon={(
            <EyeTwoTone twoToneColor={COLORS.tags.green} />
          )}>
          {showLabel && t(intl, 'actions.version', { type: '' })}
        </Button>
      </a>
    </Can>
  );
};