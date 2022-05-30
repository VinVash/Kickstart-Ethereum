import web3 from "./web3";
import campaignFactory from "./build/CampaignFactory.json";

let instance;

if (web3 !== undefined) {
  instance = new web3.eth.Contract(
    campaignFactory.abi,
    "0xBFdf45AdcD8fc6892b0854aE26c706E5C5443eA4"
  );
}

export default instance;
