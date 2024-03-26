const {
  developmentChains,
  VERIFICATION_BLOCK_CONFIRMATIONS,
} = require("../helper-hardhat-config");

const { network } = require("hardhat");
const { verify } = require("../helper-functions");

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();

  const waitBlockConfirmations = developmentChains.includes(network.name)
    ? 1
    : VERIFICATION_BLOCK_CONFIRMATIONS;

  log("----------------------------------------------------");

  const box = await deploy("Box", {
    from: deployer,
    args: [],
    log: true,
    waitConfirmations: waitBlockConfirmations,
    proxy: {
      proxyContract: "OpenZeppelinTransparentProxy",
      // we are going to use the BoxProxyAdmin contract as the admin of the proxy
      // the OpenZeppelinTransparentProxy is owned by the BoxProxyAdmin contract
      viaAdminContract: {
        name: "BoxProxyAdmin",
        artifact: "BoxProxyAdmin",
      },
    },
  });

  // Check out the hardhat-deploy examples to use UUPS proxies!
  // https://github.com/wighawag/template-ethereum-contracts

  // Verify the deployment
  if (
    !developmentChains.includes(network.name) &&
    process.env.ETHERSCAN_API_KEY
  ) {
    log("Verifying...");
    const boxAddress = (await ethers.getContract("Box_Implementation")).address;
    await verify(boxAddress, []);
  }
  log("----------------------------------------------------");
};

module.exports.tags = ["all", "box"];
