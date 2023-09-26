const ethers = require('ethers');
require('dotenv').config();

async function main() {

  const url = process.env.TESTNET_ALCHEMY_KEY;

  let artifacts = await hre.artifacts.readArtifact("MyToken");

  const provider = new ethers.providers.JsonRpcProvider(url);

  let privateKey = process.env.TESTNET_SECRET_KEY;

  let wallet = new ethers.Wallet(privateKey, provider);

  // Create an instance of a Faucet Factory
  let factory = new ethers.ContractFactory(artifacts.abi, artifacts.bytecode, wallet);

  let token = await factory.deploy();

  console.log("Contract address:", token.address);

  await token.deployed();
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
});