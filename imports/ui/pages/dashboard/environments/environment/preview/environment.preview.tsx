import React, { useContext, useEffect, useState } from "react";

import './environment.preview.module.less';
import { Button, Layout, Splitter } from "antd";
import { CaretDownOutlined, CaretLeftOutlined, CaretRightOutlined, CaretUpOutlined, SettingTwoTone } from "@ant-design/icons";
import { ArrowButtons } from "/imports/ui/components/Buttons/arrow.buttons";
import { v4 as uuidv4 } from 'uuid';
import classnames from 'classnames';
import { layout } from '../../../../../../utils/layout.util';


const { Header, Footer, Content } = Layout;

const DEFAULT_UUID = uuidv4();
const DEFAULT_LAYOUT = 'vertical';

type TPanel = { items: string[], layout: string };
type TAddPanelFn = (direction: string, uuid: string) => void;

const EnvironmentPreview = () => {

	const [activePanel, setActivePanel] = useState<string>(null);

	/**
	 * Add a new panel to the layout based on the given direction and uuid of the panel to which the new panel should be added.
	 * The new panel is added either above, below, to the left or to the right of the given panel, depending on the direction.
	 * The new panel is given a new uuid and a default layout is set.
	 * The uuid of the new panel is added to the metadata of the parent panel.
	 * @param {string} direction - The direction of the new panel relative to the given panel. Can be 'up', 'down', 'left' or 'right'.
	 * @param {string} uuid - The uuid of the panel to which the new panel should be added.
	 */
	const addPanel: TAddPanelFn = (direction: string, uuid: string): void => {
		const nextId = uuidv4();

		// Find the index of the panel that contains the uuid.
		const idx = (prev: TPanel[]) => prev.findIndex((panel: TPanel) => panel?.items?.includes(uuid));

		const toggleDirection = (direction === 'up' || direction === 'down') ? 'vertical' : 'horizontal';

		const newLayout = {
			items: [nextId],
			layout: toggleDirection
		}

		const replaceUUIDWithPanel = (panels, targetUUID: string, replacement, layout) => {
			return panels.map(panel => {
				let newItems;
				if (panel.items.length === 1) {
					return panel.items[0] === targetUUID ? replacement : panel.items[0]
				}
				newItems = panel.items.map(item => {
					if (typeof item === 'string') {
						if (item === targetUUID) {
							if (layout && panel.layout && panel.layout !== layout) {
								return {
									...replacement,
									layout
								}
							}

							return replacement
						}

						return item;
					} else {
						return replaceUUIDWithPanel([item], targetUUID, replacement, layout)[0];
					}
				});

				return { ...panel, items: newItems };
			});
		};

		switch (direction) {
			case 'up':
				setItems((prev) => {
					const items = replaceUUIDWithPanel(prev, uuid, {
						items: [nextId, uuid]
					}, 'vertical');

					setActivePanel(nextId);
					console.debug(items);
					return items;



				});
				break;
			// case 'down':
			// 	setItems((prev) => {
			// 		setActivePanel(nextId);

			// 		const index = idx(prev);
			// 		const data = prev[index];
			// 		prev[index].items = [...data.items, nextId];
			// 		return [...prev];
			// 	});
			// 	break;
			// case 'left':
			// 	setItems((prev) => {
			// 		setActivePanel(nextId);

			// 		const data = prev[idx(prev)];
			// 		prev[idx(prev)].items = [newLayout, ...data.items];
			// 		prev[idx(prev)].metadata.items.push(nextId);
			// 		return [...prev];
			// 	});
			// 	break;
			// case 'right':
			// 	setItems((prev) => {
			// 		setActivePanel(nextId);

			// 		const data = prev[idx(prev)];
			// 		prev[idx(prev)].items = [...data.items, newLayout];
			// 		prev[idx(prev)].metadata.items.push(nextId);
			// 		return [...prev];
			// 	});
			// 	break;
			default:
				console.error(`Invalid direction: ${direction}`);
		}
	}

	const panel = (index) => {
		const uuid = uuidv4();

		return (
			<Splitter.Panel key={uuid} className={classnames('panel', {
				['pActive']: index === activePanel
			})}>
				<div className={'pEdit'} onClick={() => setActivePanel(index)}>
					<Button type={"text"} icon={<SettingTwoTone />}/>
				</div>				
				{/* <div className={'pAction'}>
					<ArrowButtons className={'pBtn'} panelId={index} onClick={addPanel} />
				</div> */}
				{/* {index} */}
			</Splitter.Panel>
		)
	};

	const [items, setItems] = useState(
		[{
			"items": [
				"a98dafda-77b1-4bf7-8163-5c6a5180eb2d",
				{
					"items": [
						"091aed1e-c32c-491e-8f0a-fab79a144e46",
						{
							"items": [
								{
									"items": [
										{
											"items": [
												"89e44c45-3bde-4066-bc8e-acad68e29854",
												"19ae3a7d-aba7-49a3-a1c4-eeb91383c5b8"
											],
											"layout": "horizontal"
										},
									]
								},
								"412688cd-945b-40e0-958b-58790661f1f8",

								"4a390edd-a0df-4989-a898-2f8ba3704e41"
							],
							"layout": "vertical"
						}
					], "layout": "horizontal"
				},
				"162c0a47-a162-4545-87b8-51a8c8152163",
				{
					"items": [
						"ed972ba5-e76c-4e70-99d9-ad776a0be861",
						"3cb56a55-efc9-43f3-9def-9a98eca47c9d"
					],
					"layout": "horizontal"
				},
				"a23de486-bd1e-4c1a-af62-f1feddc179c1"
			],
			"layout": "vertical"
		}]
		// [
		// 	{
		// 		items: [
		// 			DEFAULT_UUID,
		// 			{
		// 				items: [
		// 					uuidv4(),
		// 					uuidv4(),
		// 				],
		// 				layout: 'horizontal'
		// 			},
		// 			{
		// 				items: [
		// 					uuidv4()
		// 				],
		// 			},
		// 			{
		// 				items: [
		// 					uuidv4(),
		// 					uuidv4(),
		// 				],
		// 				layout: 'horizontal'
		// 			},
		// 			uuidv4(),
		// 		],
		// 		layout: DEFAULT_LAYOUT
		// 	}
		// ]
	);

	const renderer = (parent, layout) => {
		const uuid = uuidv4();
		let splitter = typeof parent === 'string' ? panel(parent) : parent;

		if (parent.items) {
			splitter = (
				<Splitter layout={parent.layout} key={uuid}>
					{parent.items.map((child) => {
						return renderer(child, parent.layout);
					})}
				</Splitter>
			)

			if (layout && parent?.layout && parent.layout !== layout) {
				splitter = (
					<Splitter.Panel key={uuid}>
						{splitter}
					</Splitter.Panel>
				)
			}
		}

		return splitter;
	}

	console.debug(items);

	return (
		<div className="ePreview">
			{items.map((item) => {
				return renderer(item, null)
			})}
		</div>
	)
}

export default EnvironmentPreview;