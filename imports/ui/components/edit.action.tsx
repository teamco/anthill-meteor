import React, { useContext } from 'react';
import { Button } from 'antd';
import { EditTwoTone } from '@ant-design/icons';

import { Can } from '/imports/ui/components/Ability/can';

import { I18nContext } from '/imports/ui/context/i18n.context';

import { t } from '/imports/utils/i18n.util';
import { stub } from '/imports/utils/functions.util';
import { COLORS } from '/imports/utils/colors.util';

type TEditAction = {
  entityId: string;
  type?: 'primary' | 'dashed' | 'text';
  showLabel?: boolean;
  isLoading?: boolean;
  disabled?: boolean;
  onEdit?: (id: string) => void;
};

/**
 * @function EditAction
 * @description A component that renders an edit button for the given `entityId`.
 * The button is disabled if the user doesn't have enough permissions to update the given `entityId`.
 * The button is also disabled if the component is in a loading state.
 * When the button is clicked, the `onEdit` function will be called with the given `entityId`.
 * @param props The props for the component
 * @param props.entityId The id of the entity to be updated
 * @param props.type The type of a button
 * @param props.showLabel Whether or not the component should show a label
 * @param props.isLoading Whether or not the component should be in a loading state
 * @param props.disabled Whether or not the component should be disabled
 * @param props.onEdit The callback function to be called when the button is clicked
 * @returns {JSX.Element} The JSX element of the component
 */
export const EditAction: React.FC<TEditAction> = (props): JSX.Element => {
  const intl = useContext(I18nContext);

  const {
    entityId,
    type = 'primary',
    showLabel = false,
    isLoading = false,
    disabled = false,
    onEdit = stub
  } = props;

  return (
    <Can I={'update'} a={entityId}>
      <Button disabled={disabled}
        loading={isLoading}
        type={type}
        icon={<EditTwoTone twoToneColor={COLORS.success} />}
        onClick={() => onEdit(entityId)}>
        {showLabel && t(intl, 'actions.edit', { type: '' })}
      </Button>
    </Can>
  );
};