const ethers = require('ethers');
require('dotenv').config();

async function main() {

  const url = "https://eth-sepolia.g.alchemy.com/v2/BelDtllo-yLRWRfU9s9fWbl1IthSnF2N";

  let artifacts = await hre.artifacts.readArtifact("MyToken");

  const provider = new ethers.providers.JsonRpcProvider(url);

  let privateKey = "d6e330b6e39c9e4072753c84079512c364ef436f92c5b0d7dfceb231ed7183e6";

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