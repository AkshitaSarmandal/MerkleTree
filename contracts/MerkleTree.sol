// SPDX-License-Identifier: MIT

pragma solidity ^0.8.15;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract MerkleTreeERC721 is ERC721, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter public _tokenCounter;
    bytes32 public rootHash;

    constructor(bytes32 _rootHash) ERC721("Collection", "MERKLE") {
        rootHash = _rootHash;
    }

    function setRootHash(bytes32 _newRootHash) external onlyOwner {
        rootHash = _newRootHash;
    }

    function mint(bytes32[] calldata proof) external {
        require(
            verifyUser(proof, keccak256(abi.encodePacked(msg.sender))),
            "MerkleTreeERC721: User is not verifed"
        );
        _tokenCounter.increment();
        uint256 tokenId = _tokenCounter.current();
        _mint(msg.sender, tokenId);
    }

    function verifyUser(
        bytes32[] calldata proof,
        bytes32 leaf
    ) private view returns (bool) {
        return MerkleProof.verify(proof, rootHash, leaf);
    }
}
