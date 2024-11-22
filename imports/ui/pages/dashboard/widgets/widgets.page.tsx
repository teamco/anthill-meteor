import React, { useContext } from "react";
import { Col, Row } from "antd";
import { useNavigate } from "react-router-dom";
import { useTracker, useSubscribe } from "meteor/react-meteor-data";

import { EnvironmentsCollection } from "/imports/collections/environments.collection";

import Page from "/imports/ui/components/Page/page.component";
import { TileComponent } from "/imports/ui/components/Tile/tile.component";

import { I18nContext } from "/imports/ui/context/i18n.context";

import { t } from "/imports/utils/i18n.util";
import { layout } from "/imports/utils/layout.util";

const WidgetsPage: React.FC = (): JSX.Element => {
	const history = useNavigate();
	const isLoading = useSubscribe("widgets");

	const intl = useContext(I18nContext);

	return (
		<Page ableFor={{ subject: 'widgets' }} title={t(intl, 'dashboard.widgets.title')}>
			<Row gutter={[48, 48]}>
				<Col {...layout.quarterColumn}>
					widgets
				</Col>
			</Row>
		</Page>
	);
}

export default WidgetsPage;