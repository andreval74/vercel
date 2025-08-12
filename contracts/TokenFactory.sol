
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./CustomToken.sol";

/**
 * @title TokenFactory
 * @dev Factory contract to deploy tokens with custom addresses using CREATE2
 */
contract TokenFactory is ReentrancyGuard, Ownable {
    // Events
    event TokenDeployed(
        address indexed tokenAddress,
        string name,
        string symbol,
        uint256 totalSupply,
        address indexed creator,
        bytes32 salt,
        string customSuffix
    );
    
    event PaymentReceived(address indexed from, uint256 amount, string service);
    
    // Constants
    uint256 public constant STANDARD_FEE = 0.01 ether; // BNB fee for standard deployment
    uint256 public constant CUSTOM_FEE = 0.05 ether;   // BNB fee for custom suffix
    
    // State variables
    mapping(address => address[]) public userTokens;
    mapping(bytes32 => bool) public usedSalts;
    mapping(string => bool) public reservedSuffixes;
    
    uint256 public totalTokensDeployed;
    address public feeCollector;
    
    constructor() {
        feeCollector = msg.sender;
        // Reserve default suffix
        reservedSuffixes["cafe"] = true;
    }
    
    /**
     * @dev Deploy a token with standard "cafe" suffix
     */
    function deployStandardToken(
        string memory name,
        string memory symbol,
        uint256 totalSupply,
        uint8 decimals
    ) external payable nonReentrant returns (address) {
        require(msg.value >= STANDARD_FEE, "Insufficient fee");
        
        bytes32 salt = findSaltForSuffix("cafe");
        return _deployToken(name, symbol, totalSupply, decimals, salt, "cafe");
    }
    
    /**
     * @dev Deploy a token with custom suffix (4 chars max)
     */
    function deployCustomToken(
        string memory name,
        string memory symbol,
        uint256 totalSupply,
        uint8 decimals,
        string memory customSuffix
    ) external payable nonReentrant returns (address) {
        require(msg.value >= CUSTOM_FEE, "Insufficient fee for custom suffix");
        require(bytes(customSuffix).length <= 4, "Suffix too long");
        require(bytes(customSuffix).length > 0, "Suffix cannot be empty");
        require(!reservedSuffixes[customSuffix], "Suffix is reserved");
        
        bytes32 salt = findSaltForSuffix(customSuffix);
        return _deployToken(name, symbol, totalSupply, decimals, salt, customSuffix);
    }
    
    /**
     * @dev Deploy token with specific salt (for advanced users)
     */
    function deployWithSalt(
        string memory name,
        string memory symbol,
        uint256 totalSupply,
        uint8 decimals,
        bytes32 salt
    ) external payable nonReentrant returns (address) {
        require(msg.value >= STANDARD_FEE, "Insufficient fee");
        require(!usedSalts[salt], "Salt already used");
        
        return _deployToken(name, symbol, totalSupply, decimals, salt, "");
    }
    
    /**
     * @dev Internal function to deploy token using CREATE2
     */
    function _deployToken(
        string memory name,
        string memory symbol,
        uint256 totalSupply,
        uint8 decimals,
        bytes32 salt,
        string memory customSuffix
    ) internal returns (address) {
        require(!usedSalts[salt], "Salt already used");
        
        // Mark salt as used
        usedSalts[salt] = true;
        
        // Deploy token using CREATE2
        CustomToken token = new CustomToken{salt: salt}(
            name,
            symbol,
            totalSupply,
            decimals,
            msg.sender
        );
        
        address tokenAddress = address(token);
        
        // Store user's token
        userTokens[msg.sender].push(tokenAddress);
        totalTokensDeployed++;
        
        // Send fee to collector
        payable(feeCollector).transfer(msg.value);
        
        emit TokenDeployed(
            tokenAddress,
            name,
            symbol,
            totalSupply,
            msg.sender,
            salt,
            customSuffix
        );
        
        emit PaymentReceived(msg.sender, msg.value, "token_deployment");
        
        return tokenAddress;
    }
    
    /**
     * @dev Find a salt that produces an address ending with desired suffix
     */
    function findSaltForSuffix(string memory suffix) public view returns (bytes32) {
        bytes memory suffixBytes = bytes(suffix);
        bytes32 targetSuffix = bytes32(0);
        
        // Convert suffix to bytes32 (right-aligned)
        assembly {
            targetSuffix := mload(add(suffixBytes, 32))
        }
        
        // Simple algorithm - in production, this would be more sophisticated
        for (uint256 i = 0; i < 1000000; i++) {
            bytes32 salt = keccak256(abi.encodePacked(msg.sender, suffix, i));
            if (!usedSalts[salt]) {
                address predicted = predictTokenAddress(salt);
                if (_addressEndsWithSuffix(predicted, suffixBytes)) {
                    return salt;
                }
            }
        }
        
        // Fallback - return any unused salt
        return keccak256(abi.encodePacked(msg.sender, suffix, block.timestamp));
    }
    
    /**
     * @dev Predict the address of a token before deployment
     */
    function predictTokenAddress(bytes32 salt) public view returns (address) {
        bytes32 hash = keccak256(
            abi.encodePacked(
                bytes1(0xff),
                address(this),
                salt,
                keccak256(type(CustomToken).creationCode)
            )
        );
        return address(uint160(uint256(hash)));
    }
    
    /**
     * @dev Check if address ends with specific suffix
     */
    function _addressEndsWithSuffix(address addr, bytes memory suffix) internal pure returns (bool) {
        bytes20 addrBytes = bytes20(addr);
        uint256 suffixLen = suffix.length;
        
        if (suffixLen > 20) return false;
        
        for (uint256 i = 0; i < suffixLen; i++) {
            if (addrBytes[20 - suffixLen + i] != suffix[i]) {
                return false;
            }
        }
        return true;
    }
    
    /**
     * @dev Get all tokens created by a user
     */
    function getUserTokens(address user) external view returns (address[] memory) {
        return userTokens[user];
    }
    
    /**
     * @dev Reserve a suffix (admin only)
     */
    function reserveSuffix(string memory suffix) external onlyOwner {
        reservedSuffixes[suffix] = true;
    }
    
    /**
     * @dev Update fee collector
     */
    function setFeeCollector(address newCollector) external onlyOwner {
        feeCollector = newCollector;
    }
    
    /**
     * @dev Emergency withdraw
     */
    function emergencyWithdraw() external onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }
}
