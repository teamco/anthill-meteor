import { Button } from "antd";
import React, { JSX } from "react";

const HomePage: React.FC = (): JSX.Element => {
	return (
		<div>
			<h1>Home Page</h1>
			<Button type={"primary"}>Primary</Button>
		</div>
	);
}

export default HomePage;