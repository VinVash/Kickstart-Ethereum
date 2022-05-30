import Link from "next/link";
import React, { useState } from "react";
import { Form, Button, Message, Input } from "semantic-ui-react";
import Campaign from "../../../../ethereum/campaign";
import web3 from "../../../../ethereum/web3";
import Layout from "../../../../components/layout.component";
import { useRouter } from "next/router";

const RequestNew = (props) => {
  const router = useRouter();
  const { campaign } = router.query;

  const [value, setValue] = useState("");
  const [description, setDescription] = useState("");
  const [recipient, setRecipient] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    console.log(value);

    setLoading(true);
    setErrorMessage("");

    const newcampaign = Campaign(campaign);

    try {
      const accounts = await web3.eth.getAccounts();
      await newcampaign.methods
        .createRequest(description, web3.utils.toWei(value, "ether"), recipient)
        .send({ from: accounts[0] });

      router.push(`/campaigns/${campaign}/requests`);
    } catch (error) {
      setErrorMessage(error.message);
    }

    setLoading(false);
  };

  return (
    <Layout>
      <Link href={`/campaigns/${campaign}/requests`}>
        <a>
          <Button>Back</Button>
        </a>
      </Link>
      <h3>Create a request</h3>
      <Form onSubmit={onSubmit} error={!!errorMessage}>
        <Form.Field>
          <label>Description</label>
          <Input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </Form.Field>
        <Form.Field>
          <label>Value in ether</label>
          <Input value={value} onChange={(e) => setValue(e.target.value)} />
        </Form.Field>
        <Form.Field>
          <label>Recipient</label>
          <Input
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
          />
        </Form.Field>

        <Message error header="Oops!" content={errorMessage} />

        <Button primary loading={loading}>
          Create!
        </Button>
      </Form>
    </Layout>
  );
};

export default RequestNew;
