import React, { useState, useEffect } from "react";
import { Card, Button } from "semantic-ui-react";
import factory from "../ethereum/factory";
import Head from "next/head";
import Layout from "../components/layout.component";
import Link from "next/link";

const CampaignIndex = (props) => {
  const renderCampaigns = () => {
    const items = props.campaigns.map((address) => {
      return {
        header: address,
        description: (
          <Link href={`/campaigns/${address}`}>
            <a>View Campaign</a>
          </Link>
        ),
        fluid: true,
      };
    });

    return <Card.Group items={items} />;
  };

  return (
    <Layout>
      <Head>
        <title>Kickstarter | Home</title>
      </Head>
      <div>
        <h3>Open Campaigns</h3>

        <Link href="/campaigns/new">
          <a className="item">
            <Button
              content="Create Campaign"
              icon="add circle"
              primary={true}
              labelPosition="left"
              floated="right"
            />
          </a>
        </Link>

        {renderCampaigns()}
      </div>
    </Layout>
  );
};

export async function getServerSideProps() {
  const campaigns = await factory.methods.getDeployedCampaigns().call();

  return {
    props: {
      campaigns,
    },
  };
}

export default CampaignIndex;
