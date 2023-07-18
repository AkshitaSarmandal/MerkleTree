const { expect } = require("chai");
const { ethers, web3 } = require("hardhat");
const { MerkleTree } = require("merkletreejs");
const keccak256 = require("keccak256");

let proof;
let address;
let addresses;
let merkleTree;
let leaves;
let rootHash = process.env.MERKLE_ROOT;

describe("Should check the hashes", () => {
  before(async () => {
    accounts = await ethers.getSigners();
    [user, add1, add2, add3, add4, add5, add6, add7, _] = accounts;

    merkleTreeERC721 = await hre.ethers.deployContract("MerkleTreeERC721", [
      rootHash,
    ]);
    await merkleTreeERC721.waitForDeployment();
    console.log(`merkleTree with deployed to ${merkleTreeERC721.target}`);
  });

  describe("Should generate hash", () => {
    it("Should generate root and leaves", async () => {
      addresses = [add1.address, add2.address, add3.address, add4.address];

      leaves = addresses.map((add) => keccak256(add));
      merkleTree = new MerkleTree(leaves, keccak256, { sortPairs: true });
      let buf2hex = (add) => "0x" + add.toString("hex");

      rootHash = buf2hex(merkleTree.getRoot());
      address = addresses[0];
      leafAddress = keccak256(address);
      proof = merkleTree.getHexProof(leafAddress);
    });

    it("Should mint with whiteListed users", async () => {
      await merkleTreeERC721.connect(add1).mint(proof);
      let tokenId = await merkleTreeERC721._tokenCounter();
      expect(await merkleTreeERC721.ownerOf(tokenId)).to.be.equals(
        add1.address
      );
    });

    it("Should mint with whiteListed users", async () => {
      address = addresses[1];
      let leafAddress = keccak256(address);
      proof = merkleTree.getHexProof(leafAddress);
      await merkleTreeERC721.connect(add2).mint(proof);
      let tokenId = await merkleTreeERC721._tokenCounter();
      expect(await merkleTreeERC721.ownerOf(tokenId)).to.be.equals(
        add2.address
      );
    });

    it("Should check authorised user", async () => {
      await expect(merkleTreeERC721.mint(proof)).to.be.revertedWith(
        "MerkleTreeERC721: User is not verifed"
      );
    });
  });
});
