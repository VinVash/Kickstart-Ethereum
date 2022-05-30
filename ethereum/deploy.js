const HDWalletProvider = require("@truffle/hdwallet-provider");
const Web3 = require("web3");

const compiledFactory = require("./build/CampaignFactory.json");

const provider = new HDWalletProvider(
  "frog evoke vacuum element stable cover depth way dune soap lava attend",
  "https://rinkeby.infura.io/v3/33aac639f1a04732b2d8fe76e08cb182"
);
const web3 = new Web3(provider);

const deploy = async () => {
  const accounts = await web3.eth.getAccounts();

  console.log("Attempting to deploy from account", accounts[0]);

  const result = await new web3.eth.Contract(compiledFactory.abi)
    .deploy({ data: compiledFactory.evm.bytecode.object })
    .send({ gas: "2000000", from: accounts[0] });

  console.log("Contract deployed to", result.options.address);
  provider.engine.stop();
};
deploy();
