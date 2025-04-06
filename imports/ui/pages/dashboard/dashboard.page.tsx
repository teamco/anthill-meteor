import React, { JSX, useContext } from "react";
import { Col, Row } from "antd";
import { useNavigate } from "react-router-dom";
import { useTracker, useSubscribe } from "meteor/react-meteor-data";

import { EnvironmentsCollection } from "/imports/collections/environments.collection";

import Page from "/imports/ui/components/Page/page.component";
import { TileComponent } from "/imports/ui/components/Tile/tile.component";

import { I18nContext } from "/imports/ui/context/i18n.context";

import { t } from "/imports/utils/i18n.util";
import { layout } from "/imports/utils/layout.util";

/**
 * DashboardPage component
 *
 * This component renders the dashboard page including a list of environments fetched
 * from the EnvironmentsCollection. It provides functionality to create a new environment
 * using a button, which triggers the creation of an environment with an empty layout
 * and a single empty widget. The component uses Meteor's reactive data sources to
 * subscribe to the environments publication and track the environment data.
 *
 * @returns {JSX.Element} The JSX element representing the dashboard page
 */
const DashboardPage: React.FC = (): JSX.Element => {
  const history = useNavigate();
  const isLoading = useSubscribe("environments");
  const envs: any[] = useTracker(
    () => EnvironmentsCollection.find({}).fetch(),
    []
  );

  const intl = useContext(I18nContext);

  const navigateTo = {
    environments: () => history("/dashboard/environments"),
  };

  return (
    <Page
      ableFor={{ subject: "dashboard" }}
      title={t(intl, "dashboard.title")}
      description={t(intl, "dashboard.description")}
    >
      <Row gutter={[48, 48]}>
        <Col {...layout.quarterColumn}>
          <TileComponent
            isLoading={isLoading()}
            title={"Environments"}
            onClick={navigateTo.environments}
            description={envs.length.toString()}
          />
        </Col>
      </Row>
    </Page>
  );
};

export default DashboardPage;
