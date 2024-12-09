import React, { useCallback, useContext, useMemo, useState } from "react";
import { useIntl } from "react-intl";
import { Button, Modal, Splitter } from "antd";
import { SettingTwoTone } from "@ant-design/icons";
import { v4 as uuidv4 } from 'uuid';
import classnames from 'classnames';

import { ArrowButtons } from "/imports/ui/components/Buttons/arrow.buttons";

import { NotificationContext } from "/imports/ui/context/notification.context";

import { TSplitter, TSplitterItem, TSplitterLayout } from "/imports/config/types";

import { t, TIntl } from "/imports/utils/i18n.util";
import { deletePanel, replacePanel } from "/imports/utils/antd.util";

import './environment.preview.module.less';

const DEFAULT_UUID = uuidv4();
const DEFAULT_LAYOUT: TSplitterLayout = 'vertical';

type TAddPanelFn = (direction: string, uuid: string) => void;
type TDirection = 'up' | 'down' | 'left' | 'right';

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

	const initialSplitter = useMemo(() => ({
		items: [{ uuid: DEFAULT_UUID, size: '100%' }],
		layout: DEFAULT_LAYOUT,
		parentId: uuidv4()
	}), []);

	const [activePanel, setActivePanel] = useState<string>(null);
	const [splitter, setSplitter] = useState<TSplitter>(initialSplitter);
console.debug(1,splitter)
	/**
	 * Handles the deletion of the panel with the given uuid in the Splitter component.
	 * If the Splitter component has only one panel, the function does nothing.
	 * Otherwise, the panel is deleted and the Splitter component is updated accordingly.
	 * The uuid of the deleted panel is removed from the metadata of the parent panel.
	 */
	const handleDelete = (): void => {
		console.debug(2,splitter)
		// if (splitter.items.length === 1) return;

		const updatedSplitter = deletePanel(splitter, activePanel);
		setSplitter(updatedSplitter);
	}

	/**
	 * Add a new panel to the layout based on the given direction and uuid of the panel to which the new panel should be added.
	 * The new panel is added either above, below, to the left or to the right of the given panel, depending on the direction.
	 * The new panel is given a new uuid and a default layout is set.
	 * The uuid of the new panel is added to the metadata of the parent panel.
	 * @param {TDirection} direction - The direction of the new panel relative to the given panel. Can be 'up', 'down', 'left' or 'right'.
	 * @param {string} uuid - The uuid of the panel to which the new panel should be added.
	 */
	const addPanel: TAddPanelFn = (direction: TDirection, uuid: string): void => {
		const nextId = uuidv4();

		/**
		 * Updates the Splitter component by replacing the panel with the given uuid with a new panel.
		 * The new panel has the given layout and items.
		 * The uuid of the new panel is added to the metadata of the parent panel.
		 * @param {TSplitterLayout} layout - The layout of the new panel. Can be 'vertical' or 'horizontal'.
		 * @param {any[]} items - The items of the new panel. Can be a list of uuids, or a list of objects with uuid property.
		 */
		const updateSplitter = (layout: TSplitterLayout, items: TSplitterItem[]): void => {
			setSplitter((prev: TSplitter) => replacePanel(prev, uuid, { items }, layout));
		};

		switch (direction) {
			case 'up':
				updateSplitter('vertical', [{ uuid: nextId }, { uuid }]);
				break;
			case 'down':
				updateSplitter('vertical', [{ uuid }, { uuid: nextId }]);
				break;
			case 'left':
				updateSplitter('horizontal', [{ uuid: nextId }, { uuid }]);
				break;
			case 'right':
				updateSplitter('horizontal', [{ uuid }, { uuid: nextId }]);
				break;
			default:
				modalApi.error({
					title: t(intl, 'error.invalidDirection'),
					content: t(intl, 'error.invalidDirectionMessage', { direction })
				});
		}
	}

	/**
	 * Render a Splitter Panel with a uuid as key.
	 * The panel is given a class of 'panel' and 'pActive' if the index matches the activePanel state.
	 * The panel contains two elements: a div with class 'pEdit' that is clickable and sets the activePanel state
	 * to the given index, and a Button with class 'pMgmt' that is clickable and calls the handleSplitter function.
	 * @param {string} index - The uuid of the panel
	 * @returns {JSX.Element} - A Splitter.Panel component
	 */
	const renderPanel = useCallback((index: string): JSX.Element => (
		<Splitter.Panel key={index} className={classnames('panel', {
			['pActive']: index === activePanel
		})}>
			<div className={'pEdit'} onClick={() => setActivePanel(index)}>{index}</div>
			<Button
				className={'pMgmt'}
				type={"text"}
				icon={<SettingTwoTone />}
				onClick={handleSplitter}
			/>
		</Splitter.Panel>
	), [activePanel]);

	const handleSplitter = useCallback(() => {
		modalApi.info({
			width: 600,
			title: t(intl, 'actions.addNew', { type: t(intl, 'widget.title') }),
			content: (
				<>
					<ArrowButtons className={'pBtn'} panelId={activePanel} onClick={addPanel} />
					<Button onClick={handleDelete}>del</Button>
				</>
			),
			footer: (
				<Button key={'back'} onClick={Modal.destroyAll}>
					{t(intl, 'actions.close')}
				</Button>
			)
		})
	}, [activePanel, splitter]);

	const handleSizeChange = useCallback((uuid: string, size) => {
		console.debug(uuid, size, splitter);
		// setSplitter((prev: TSplitter) => replacePanel(prev, uuid, { size }))
	}, [splitter]);

	/**
	 * A recursive function that renders a Splitter component based on the given node and layout.
	 * If the node has a uuid, it renders a Splitter.Panel with the uuid as key and the uuid as content.
	 * Otherwise it renders a Splitter component with the node's items as children.
	 * If the node has items, the children are rendered recursively with the node's layout.
	 * If the layout is given, the children are rendered inside a Splitter.Panel.
	 * @param {TSplitter} node - The node to render.
	 * @param {TSplitterLayout} layout - The layout of the node.
	 * @returns {JSX.Element} The rendered Splitter component.
	 */
	const renderer = (node: TSplitter, layout: TSplitterLayout): JSX.Element => {
		const uuid: string = node?.uuid || uuidv4();

		let _splitter = node?.uuid ? renderPanel(node.uuid) : <>node</>;

		if (node?.items) {
			const children = node.items.map((child: TSplitter) => renderer(child, node.layout));
			
			_splitter = (
				<Splitter
					layout={node.layout}
					// onResizeEnd={size => handleSizeChange(node.parentId, size)}
					key={uuid}>
					{children}
				</Splitter>
			);

			if (layout) {
				_splitter = <Splitter.Panel key={uuid}>{_splitter}</Splitter.Panel>
			}
		}

		return _splitter;
	}

	return (
		<div className="ePreview" key={'preview'}>
			{renderer(splitter, null)}
		</div>
	)
}

export default EnvironmentPreview;