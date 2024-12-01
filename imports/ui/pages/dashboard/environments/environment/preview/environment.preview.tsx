import React, { useContext, useEffect, useState } from "react";

import './environment.preview.module.less';
import { Button, Layout, Splitter } from "antd";
import { Outlet } from "react-router-dom";
import { CaretDownOutlined, CaretLeftOutlined, CaretRightOutlined, CaretUpOutlined } from "@ant-design/icons";
import { ArrowButtons } from "/imports/ui/components/Buttons/arrow.buttons";
import { v4 as uuidv4 } from 'uuid';


const { Header, Footer, Content } = Layout;

const DEFAULT_UUID = uuidv4();
const DEFAULT_LAYOUT = 'vertical';

const EnvironmentPreview = () => {

	const [direction, setDirection] = useState(null);

	const addPanel = (direction, layout, uuid) => {
		// const newPanel = {
		// 	id: `panel-${panels.length + 1}`,
		// 	children: <div>New Panel</div>,
		// };
		console.debug(direction, layout, uuid);
		switch (direction) {
			case 'up':
				setItems((prev) => ({
					...prev,
					[uuid]: {
						layout: 'vertical',
						items: [panel(layout), ...prev[uuid].items]
					},
				}));
				break;
			case 'down':
				setItems((prev) => ({
					...prev,
					[uuid]: {
						layout: 'vertical',
						items: [...prev[uuid].items, panel(layout)]
					},
				}));
				break;
			case 'left':
				setItems((prev) => {
					debugger
					return {
						...prev,
						[uuid]: {
							layout: 'horizontal',
							items: [panel(layout), ...prev[uuid].items]
						},
					}
				});
				break;
			case 'right':
				setItems((prev) => [{
					layout: 'horizontal',
					items: [
						...prev[0].items,
						panel(layout, uuid)
					]
				}]);
				break;
			default:
				console.error(`Invalid direction: ${direction}`);
		}
	}

	const panel = () => {
		const uuid = uuidv4();
console.debug('panel',uuid);
		return (
			<Splitter.Panel key={uuid}>
				<div className={'pAction'}>
					<ArrowButtons className={'pBtn'} panelId={uuid} onClick={addPanel} />
				</div>
				{uuid}
			</Splitter.Panel>
		)
	};

	const [items, setItems] = useState([
		{ 
			items: [
				panel(),
				panel(),
				{ 
					items: [
						panel(),		
						panel(),
					], 
					layout: 'horizontal' 
				},
				panel(),
			], 
			layout: DEFAULT_LAYOUT 
		}
	]);

	const renderer = (parent, uuid, layout) => {
		let splitter = parent;
console.debug('renderer',uuid);
		if (parent.items) {
			splitter = (
				<Splitter layout={parent.layout} key={uuid}>
					{parent.items.map((child) => {
						return renderer(child, uuid, parent.layout);
					})}
				</Splitter>
			)

			if (layout && parent.layout !== layout) {
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
			{Object.keys(items).map((uuid) => {
				return renderer(items[uuid], uuid, null)
			})}
		</div>
	)
}

export default EnvironmentPreview;