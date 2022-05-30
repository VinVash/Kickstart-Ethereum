import React from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { Button, Table } from "semantic-ui-react";
import Layout from "../../../../components/layout.component";
import RequestRow from "../../../../components/requestRow.component";
import Campaign from "../../../../ethereum/campaign";

const RequestIndex = (props) => {
  const router = useRouter();
  const { campaign } = router.query;

  const renderRows = () => {
    return props.requests.map((request, index) => {
      return (
        <RequestRow
          request={request}
          key={index}
          address={props.campaign}
          id={index}
          approversCount={props.approversCount}
        />
      );
    });
  };

  const { Header, Row, HeaderCell, Body } = Table;

  return (
    <Layout>
      <h3>Requests</h3>
      <Link href={`/campaigns/${campaign}/requests/new`}>
        <a>
          <Button primary floated="right" style={{ marginBottom: 10 }}>
            Add Request
          </Button>
        </a>
      </Link>
      <Table>
        <Header>
          <Row>
            <HeaderCell>ID</HeaderCell>
            <HeaderCell>Description</HeaderCell>
            <HeaderCell>Amount</HeaderCell>
            <HeaderCell>Recipient</HeaderCell>
            <HeaderCell>Approval</HeaderCell>
            <HeaderCell>Approve</HeaderCell>
            <HeaderCell>Finalize</HeaderCell>
          </Row>
        </Header>

        <Body>{renderRows()}</Body>
      </Table>

      <div>Found {props.requestCount} requests.</div>
    </Layout>
  );
};

export async function getServerSideProps(props) {
  const { campaign } = props.query;
  const newcampaign = Campaign(campaign);
  const requestCount = await newcampaign.methods.getRequestsCount().call();
  const approversCount = await newcampaign.methods.approversCount().call();

  const requests = await Promise.all(
    Array(parseInt(requestCount))
      .fill()
      .map((element, index) => {
        return newcampaign.methods.requests(index).call();
      })
  );

  return {
    props: {
      campaign: campaign,
      requests: JSON.parse(JSON.stringify(requests)),
      requestCount: requestCount,
      approversCount: approversCount,
    },
  };
}

export default RequestIndex;
