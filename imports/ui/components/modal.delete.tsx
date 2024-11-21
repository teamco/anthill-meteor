import React from 'react';
import { Modal, Button } from 'antd';

import { t } from '/imports/utils/i18n.util';
import { stub } from '/imports/utils/functions.util';
import { nCache } from '/imports/utils/message.util';

type TDeleteWarning = {
  entity?: string,
  styles?: any,
  title?: string,
  content?: string,
  onApprove?: () => void
}

/**
 * Displays a modal warning the user about deleting an entity.
 *
 * @param {string} props.entity The type of the entity to delete.
 * @param {object} props.styles The style of the modal.
 * @param {string} props.title The title of the modal.
 * @param {string} props.content The content of the modal.
 * @param {function} props.onApprove The function to call when the user confirms the deletion.
 */
export const deleteWarning = (props: TDeleteWarning): void => {
  const modalApi = nCache.get('modalApi');
  const intl = nCache.get('intl');

  const { entity = '' } = props;

  const {
    title = t(intl, 'message.delete.warning', { type: entity }),
    content = t(intl, 'message.delete.confirm', { type: entity }),
    onApprove = stub
  } = props;

  modalApi.warning({
    title,
    content,
    className: 'modalApi',
    centered: true,
    footer: (
      <div className={'modalFooter'}>
        <Button key={'back'} onClick={Modal.destroyAll}>
          {t(intl, 'actions.cancel')}
        </Button>
        <Button key={'confirm'}
          type={'primary'}
          danger
          onClick={(e) => {
            e.preventDefault();

            Modal.destroyAll();
            onApprove();
          }}>
          {t(intl, 'actions.confirm')}
        </Button>
      </div>
    )
  });
};

