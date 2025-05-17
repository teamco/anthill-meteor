import React, {
  JSX,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useIntl } from 'react-intl';
import { Button, Modal, Splitter } from 'antd';
import { SettingTwoTone } from '@ant-design/icons';
import classnames from 'classnames';
import { createFileRoute } from '@tanstack/react-router';

import { ArrowButtons } from '/imports/ui/components/Buttons/arrow.buttons';

import { NotificationContext } from '/imports/ui/context/notification.context';

import { t, TIntl } from '/imports/utils/i18n.util';

import {
  TAddPanelFn,
  TDirection,
  TRouterTypes,
  TSplitter,
  TSplitterItem,
  TSplitterLayout,
} from '/imports/config/types';

import './environment.preview.module.less';
import {
  cleanPanel,
  deletePanel,
  findAndUpdateNodeByItems,
  replacePanel,
} from '/imports/utils/splitter.util';
import { generateId } from '/imports/utils/generator.util';

// import { splitterMock } from "./__tests__/splitter.mock";

const DEFAULT_UUID = generateId();
const DEFAULT_LAYOUT: TSplitterLayout = 'vertical';

/**
 * A component that renders a Splitter component that can be edited by adding new panels.
 * The component is given an initial state of a Splitter with a single panel.
 * The component renders a Splitter component with the given state.
 * The component provides a function to add a new panel to the layout.
 * The new panel is added either above, below, to the left or to the right of the given panel, depending on the direction.
 * The new panel is given a new uuid and a default layout is set.
 * The uuid of the new panel is added to the metadata of the parent panel.
 * The component also provides a function to render a Splitter Panel with a uuid as key.
 * The panel is given a class of 'panel' and 'pActive' if the index matches the activePanel state.
 * The panel contains two elements: a div with class 'pEdit' that is clickable and sets the activePanel state
 * to the given index, and a Button with class 'pMgmt' that is clickable and calls the handleSplitter function.
 * The component also provides a function to handle the Splitter component.
 * The function is called when the Splitter component is clicked.
 * The function renders a Modal component with a title and content.
 * The content is a component that renders a Button with class 'pBtn' that is clickable and calls the addPanel function.
 * The footer of the Modal is a Button with class 'back' that is clickable and closes the Modal.
 * @returns {JSX.Element} - The rendered Splitter component.
 */
const EnvironmentPreview: React.FC = (): JSX.Element => {
  const intl: TIntl = useIntl();
  const { modalApi } = useContext(NotificationContext);

  const initialSplitter = useMemo(
    () => ({
      items: [
        { uuid: DEFAULT_UUID, size: '100%' },
        // ...splitterMock,
      ],
      layout: DEFAULT_LAYOUT,
      // parentId: uuidv4(),
    }),
    [],
  );

  const [activePanel, setActivePanel] = useState<string | null>(null);
  const [splitter, setSplitter] = useState<TSplitter>(initialSplitter);

  const lastResizeRef = useRef<number>(0);

  /**
   * Handles the deletion of the panel with the given uuid in the Splitter component.
   * If the Splitter component only has one panel, the function returns without doing anything.
   * The function deletes the panel with the given uuid from the Splitter component by calling the deletePanel function.
   * The function then cleans the Splitter component by calling the cleanPanel function.
   * If the cleaned Splitter component still has panels, the function updates the Splitter component by calling the setSplitter function.
   */
  const handleDelete = (): void => {
    //if (splitter.items.length === 1) return;

    const updatedSplitter = deletePanel(splitter, activePanel as string);
    const cleaned = cleanPanel(updatedSplitter);

    if (cleaned.items?.length) {
      setSplitter(cleaned);
    }
  };

  /**
   * Add a new panel to the layout based on the given direction and uuid of the panel to which the new panel should be added.
   * The new panel is added either above, below, to the left or to the right of the given panel, depending on the direction.
   * The new panel is given a new uuid and a default layout is set.
   * The uuid of the new panel is added to the metadata of the parent panel.
   * @param {TDirection} direction - The direction of the new panel relative to the given panel. Can be 'up', 'down', 'left' or 'right'.
   * @param {string} parentId - The uuid of the panel to which the new panel should be added.
   */
  const addPanel: TAddPanelFn = (
    direction: TDirection,
    parentId: string,
  ): void => {
    if (!parentId || parentId.trim() === '') {
      modalApi.error({
        title: t(intl, 'error.invalidParent'),
        content: t(intl, 'error.invalidParentMessage'),
      });
      return;
    }

    const nextId = generateId();

    /**
     * Updates the Splitter component by replacing the panel with the given uuid with a new panel.
     * The new panel has the given layout and items.
     * The uuid of the new panel is added to the metadata of the parent panel.
     * @param {TSplitterLayout} layout - The layout of the new panel. Can be 'vertical' or 'horizontal'.
     * @param {any[]} items - The items of the new panel. Can be a list of uuids, or a list of objects with uuid property.
     */
    const updateSplitter = (
      layout: TSplitterLayout,
      items: TSplitterItem[],
    ): void => {
      setSplitter((prev: TSplitter) =>
        replacePanel(prev, parentId, { items }, layout),
      );
    };

    switch (direction) {
      case 'up':
        updateSplitter('vertical', [
          { uuid: nextId, parentId, size: '100%' },
          { uuid: parentId, parentId, size: '100%' },
        ]);
        break;
      case 'down':
        updateSplitter('vertical', [
          { uuid: parentId, parentId, size: '100%' },
          { uuid: nextId, parentId, size: '100%' },
        ]);
        break;
      case 'left':
        updateSplitter('horizontal', [
          { uuid: nextId, parentId, size: '50%' },
          { uuid: parentId, parentId, size: '50%' },
        ]);
        break;
      case 'right':
        updateSplitter('horizontal', [
          { uuid: parentId, parentId, size: '50%' },
          { uuid: nextId, parentId, size: '50%' },
        ]);
        break;
      default:
        modalApi.error({
          title: t(intl, 'error.invalidDirection'),
          content: t(intl, 'error.invalidDirectionMessage', { direction }),
        });
    }
  };

  /**
   * Renders a Splitter.Panel component for the given node.
   * The panel is assigned a unique key and appropriate CSS classes based on its active state.
   * It includes a clickable div that sets the active panel and a button that opens the splitter settings.
   *
   * @param {TSplitter} node - The node to render as a Splitter.Panel.
   * @returns {JSX.Element} The rendered Splitter.Panel component.
   */
  const renderPanel = useCallback(
    (node: TSplitter): JSX.Element => {
      if (!node?.uuid) {
        throw new Error(
          'Invalid node provided to renderPanel',
          node as Partial<ErrorOptions>,
        );
      }

      return (
        <Splitter.Panel
          key={node.uuid}
          defaultSize={node?.size}
          className={classnames('panel', {
            ['pActive']: node.uuid === activePanel,
          })}
        >
          <div
            className={'pEdit'}
            onClick={() => setActivePanel(node?.uuid as string)}
          >
            {node.uuid}
            <br />
            <div style={{ color: 'red' }}>{node.parentId}</div>
            {node.size && (
              <div>
                <div style={{ color: 'blue' }}>Size: {node.size}</div>
              </div>
            )}
          </div>
          <Button
            className={'pMgmt'}
            type={'text'}
            icon={<SettingTwoTone />}
            onClick={handleSplitterSetting}
          />
        </Splitter.Panel>
      );
    },
    [activePanel],
  );

  const handleSplitterSetting = useCallback(() => {
    modalApi.info({
      width: 600,
      title: t(intl, 'actions.addNew', { type: t(intl, 'widget.title') }),
      content: (
        <>
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

  /**
   * Handles the size change of a splitter panel.
   * Updates the size property of each child item in the splitter node
   * while preserving the layout and other properties throughout the entire structure.
   *
   * @param {TSplitter} node - The splitter node whose children's sizes are being updated
   * @param {number[]} sizes - Array of new sizes for the child items
   */
  const handleSizeChange = useCallback(
    (node: TSplitter, sizes: number[]) => {
      // Prevent duplicate call if sizes didn't actually change
      if (lastResizeRef.current === 1) {
        lastResizeRef.current = 0;
        return;
      }

      lastResizeRef.current = 1;

      if (!node || !node.items || !sizes?.length) {
        console.warn('Invalid input to handleSizeChange:', { node, sizes });
        return;
      }

      setSplitter((prevSplitter) => {
        // Create a deep copy to avoid mutation using structured clone
        let updatedSplitter: TSplitter;
        try {
          // Create a deep copy to avoid mutation using structured clone
          updatedSplitter = structuredClone(prevSplitter);
        } catch (error) {
          console.error('Failed to clone splitter structure:', error);
          modalApi.error({
            title: t(intl, 'error.cloneFailure'),
            content: t(intl, 'error.cloneFailureMessage', { id: node.uuid }),
          });
          return prevSplitter; // Return unchanged state on error
        }

        // Find and update the node
        const nodeFound = findAndUpdateNodeByItems(
          updatedSplitter,
          node.items as TSplitterItem[],
          sizes,
        );

        if (!nodeFound) {
          console.warn('Could not find the node to update sizes for:', node);
        }

        return updatedSplitter;
      });
    },
    [splitter],
  );

  /**
   * A recursive function that renders a Splitter component based on the given node and layout.
   * If the node has an uuid, it renders a Splitter.Panel with the uuid as key and the uuid as content.
   * Otherwise, it renders a Splitter component with the node's items as children.
   * If the node has items, the children are rendered recursively with the node's layout.
   * If the layout is given, the children are rendered inside a Splitter.Panel.
   * @param {TSplitter} node - The node to render.
   * @param {TSplitterLayout} layout - The layout of the node.
   * @returns {JSX.Element} The rendered Splitter component.
   */
  const renderer = (node: TSplitter, layout: TSplitterLayout): JSX.Element => {
    const uuid: string = node?.uuid || generateId();

    let _splitter = node?.uuid ? renderPanel(node) : <>node</>;

    if (node?.items) {
      const children = node.items.map((child: TSplitter) =>
        renderer(child, node.layout as TSplitterLayout),
      );

      _splitter = (
        <Splitter
          lazy
          layout={node.layout as TSplitterLayout}
          onResizeEnd={(sizes) => {
            handleSizeChange(node, sizes);
          }}
          key={uuid}
        >
          {children}
        </Splitter>
      );

      if (layout) {
        _splitter = <Splitter.Panel key={uuid}>{_splitter}</Splitter.Panel>;
      }
    }

    return _splitter;
  };

  return (
    <div className="ePreview" key={'preview'}>
      {renderer(splitter, undefined)}
    </div>
  );
};

export const Route = createFileRoute(
  TRouterTypes.DASHBOARD_ENVIRONMENT_PREVIEW,
)({
  component: EnvironmentPreview,
});
