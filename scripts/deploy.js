const hre = require("hardhat");
require("dotenv").config();

async function main() {
  const ROOT = process.env.MERKLE_ROOT;
  const merkleTree = await hre.ethers.deployContract("MerkleTreeERC721", [
    ROOT,
  ]);

  await merkleTree.waitForDeployment();

  console.log(`merkleTree with deployed to ${merkleTree.target}`);

  await hre.run("verify:verify", {
    address: merkleTree.target,
    constructorArguments: [ROOT],
  });
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
