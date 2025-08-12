
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract SaltGenerator {
    // Salt baseado em parâmetros do token
    function generateSaltFromParams(
        string memory name,
        string memory symbol,
        address owner,
        uint256 nonce
    ) public pure returns (bytes32) {
        return keccak256(abi.encodePacked(name, symbol, owner, nonce));
    }
    
    // Salt baseado no sender e timestamp
    function generateSaltFromSender(uint256 nonce) public view returns (bytes32) {
        return keccak256(abi.encodePacked(msg.sender, block.timestamp, nonce));
    }
    
    // Salt incremental simples
    function generateIncrementalSalt(uint256 id) public pure returns (bytes32) {
        return bytes32(id);
    }
    
    // Salt personalizado baseado em string
    function generateSaltFromString(string memory input) public pure returns (bytes32) {
        return keccak256(abi.encodePacked(input));
    }
    
    // Salt baseado em múltiplos parâmetros
    function generateCustomSalt(
        address user,
        string memory tokenName,
        string memory customString,
        uint256 timestamp,
        uint256 nonce
    ) public pure returns (bytes32) {
        return keccak256(abi.encodePacked(
            user,
            tokenName,
            customString,
            timestamp,
            nonce
        ));
    }
}
