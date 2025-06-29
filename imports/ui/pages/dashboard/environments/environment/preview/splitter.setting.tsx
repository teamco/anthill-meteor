import React, { useCallback, useContext } from 'react';
import { SettingTwoTone } from '@ant-design/icons';
import { Button, Modal } from 'antd';
import { useIntl } from 'react-intl';

import { NotificationContext } from '/imports/ui/context/notification.context';
import { t, TIntl } from '/imports/utils/i18n.util';
import { TAddPanelFn, TSplitter } from '/imports/config/types';

import { ArrowButtons } from '/imports/ui/components/Buttons/arrow.buttons';

import './environment.preview.module.less';

type TProps = {
  node: TSplitter;
  activePanel: string;
  splitter: TSplitter;
  addPanel: TAddPanelFn;
  handleDelete: () => void;
};

/**
 * A component that renders a Button with a SettingTwoTone icon.
 * When clicked, it renders a Modal with a title and content.
 * The content is a component that renders a Button with class 'pBtn' that is clickable and calls the addPanel function.
 * The footer of the Modal is a Button with class 'back' that is clickable and closes the Modal.
 * @param {TProps} props - The props of the component.
 * @returns {React.JSX.Element | null} - The rendered Button component.
 */
export const SplitterSetting: React.FC<TProps> = (
  props: TProps,
): React.JSX.Element | null => {
  const { node, activePanel, splitter, addPanel, handleDelete } = props;

  if (!activePanel) {
    console.info('The activePanel is not defined');
    return null;
  }

  const intl: TIntl = useIntl();
  const { modalApi } = useContext(NotificationContext);

  const handleSplitterSetting = useCallback(() => {
    modalApi?.info({
      width: 600,
      title: t(intl, 'actions.addNew', { type: t(intl, 'widget.title') }),
      content: (
        <>
          {node.uuid}
          <div>{node.parentId}</div>
          {node.size && (
            <div>
              <div>Size: {node.size}</div>
            </div>
          )}
          <ArrowButtons
            className={'pBtn'}
            panelId={activePanel as string}
            onClick={addPanel}
          />
          <Button onClick={handleDelete}>del</Button>
        </>
      ),
      footer: (
        <Button key={'back'} onClick={Modal.destroyAll}>
          {t(intl, 'actions.close')}
        </Button>
      ),
    });
  }, [activePanel, splitter]);

  return (
    <Button
      className={'pMgmt'}
      type={'text'}
      icon={<SettingTwoTone />}
      onClick={handleSplitterSetting}
    />
  );
};
