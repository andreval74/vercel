
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

/**
 * @title CustomToken
 * @dev ERC20 token template deployed by TokenFactory
 */
contract CustomToken is ERC20, ERC20Burnable, Ownable, Pausable {
    uint8 private _decimals;
    uint256 public maxSupply;
    bool public mintingFinished;
    
    // Anti-whale mechanism
    uint256 public maxWalletAmount;
    bool public maxWalletEnabled;
    
    // Trading controls
    bool public tradingEnabled;
    mapping(address => bool) public whitelist;
    
    // Events
    event MintingFinished();
    event TradingEnabled();
    event MaxWalletUpdated(uint256 maxAmount);
    event WhitelistUpdated(address indexed account, bool status);
    
    constructor(
        string memory name,
        string memory symbol,
        uint256 totalSupply,
        uint8 decimalsValue,
        address initialOwner
    ) ERC20(name, symbol) {
        _decimals = decimalsValue;
        maxSupply = totalSupply;
        maxWalletAmount = totalSupply / 100; // 1% of total supply by default
        maxWalletEnabled = true;
        tradingEnabled = false;
        
        // Mint initial supply to creator
        _mint(initialOwner, totalSupply);
        _transferOwnership(initialOwner);
        
        // Add creator to whitelist
        whitelist[initialOwner] = true;
        whitelist[address(0)] = true; // Allow burning
    }
    
    /**
     * @dev Returns the number of decimals used to get its user representation.
     */
    function decimals() public view virtual override returns (uint8) {
        return _decimals;
    }
    
    /**
     * @dev Enable trading (one-way action)
     */
    function enableTrading() external onlyOwner {
        tradingEnabled = true;
        emit TradingEnabled();
    }
    
    /**
     * @dev Update max wallet amount
     */
    function setMaxWalletAmount(uint256 _maxWalletAmount) external onlyOwner {
        require(_maxWalletAmount >= totalSupply() / 1000, "Max wallet too low"); // Min 0.1%
        maxWalletAmount = _maxWalletAmount;
        emit MaxWalletUpdated(_maxWalletAmount);
    }
    
    /**
     * @dev Toggle max wallet mechanism
     */
    function setMaxWalletEnabled(bool _enabled) external onlyOwner {
        maxWalletEnabled = _enabled;
    }
    
    /**
     * @dev Update whitelist status
     */
    function updateWhitelist(address account, bool status) external onlyOwner {
        whitelist[account] = status;
        emit WhitelistUpdated(account, status);
    }
    
    /**
     * @dev Batch whitelist update
     */
    function batchUpdateWhitelist(address[] calldata accounts, bool status) external onlyOwner {
        for (uint256 i = 0; i < accounts.length; i++) {
            whitelist[accounts[i]] = status;
            emit WhitelistUpdated(accounts[i], status);
        }
    }
    
    /**
     * @dev Mint additional tokens (if not finished)
     */
    function mint(address to, uint256 amount) external onlyOwner {
        require(!mintingFinished, "Minting is finished");
        require(totalSupply() + amount <= maxSupply, "Exceeds max supply");
        _mint(to, amount);
    }
    
    /**
     * @dev Finish minting forever
     */
    function finishMinting() external onlyOwner {
        mintingFinished = true;
        emit MintingFinished();
    }
    
    /**
     * @dev Pause contract
     */
    function pause() external onlyOwner {
        _pause();
    }
    
    /**
     * @dev Unpause contract
     */
    function unpause() external onlyOwner {
        _unpause();
    }
    
    /**
     * @dev Override transfer to add trading and max wallet checks
     */
    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 amount
    ) internal override whenNotPaused {
        // Check if trading is enabled (except for whitelisted addresses)
        if (!tradingEnabled && !whitelist[from] && !whitelist[to]) {
            require(from == address(0) || to == address(0), "Trading not enabled");
        }
        
        // Check max wallet limit
        if (maxWalletEnabled && to != address(0) && !whitelist[to]) {
            require(balanceOf(to) + amount <= maxWalletAmount, "Exceeds max wallet");
        }
        
        super._beforeTokenTransfer(from, to, amount);
    }
    
    /**
     * @dev Get token info
     */
    function getTokenInfo() external view returns (
        string memory tokenName,
        string memory tokenSymbol,
        uint8 tokenDecimals,
        uint256 tokenTotalSupply,
        uint256 tokenMaxSupply,
        bool tokenTradingEnabled,
        bool tokenMintingFinished,
        uint256 tokenMaxWallet
    ) {
        return (
            name(),
            symbol(),
            decimals(),
            totalSupply(),
            maxSupply,
            tradingEnabled,
            mintingFinished,
            maxWalletAmount
        );
    }
}
