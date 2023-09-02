//import

const { network } = require("hardhat");
const {
  networkConfig,
  developmetnChains,
} = require("../helper-hardhat-config");
const { verify } = require("../utils/verify");
// function delopyFunc() {
//   console.log("hi");
// }

// module.exports.default = delopyFunc;

module.exports = async ({ getNamedAccounts, deployments }) => {
  //   const { getNameA } = hre;
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();
  const chainId = network.config.chainId;

  // if chainid is x use address y
  // let ethUsdPriceFeedAddress = networkConfig[chainId]["ethUsdPriceFeed"];
  let ethUsdPriceFeedAddress;
  if (developmetnChains.includes(network.name)) {
    const ethUsdAggregator = await deployments.get("MockV3Aggregator");
    ethUsdPriceFeedAddress = ethUsdAggregator.address;
  } else {
    ethUsdPriceFeedAddress = networkConfig[chainId]["ethUsdPriceFeed"];
  }
  //if the contract doesn't exist , we deploy a minimal version fo it
  //  for our local test
  //well what happens when we to change chain
  //when going for localhost or hardhat network we want to use a mock
  const args = [ethUsdPriceFeedAddress];

  const fundMe = await deploy("FundMe", {
    from: deployer,
    args: args, // put price feed
    log: true,
    waitConfirmations: 1,
  });
  if (
    !developmetnChains.includes(network.name) &&
    process.env.ETHERSCAN_API_KEY
  ) {
    //verify

    await verify(fundMe.address, args);
  }
  log("----------------------------------");
};

module.exports.tags = ["all", "fundme"];
