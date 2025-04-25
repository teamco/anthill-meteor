import { Modal } from 'antd';

/**
 * Closes all modals when called.
 * @returns {void}
 */
export const onModalCancel = (): void => {
  Modal.destroyAll();
};
