
import { ethers, BrowserProvider, Contract, isAddress, keccak256, toUtf8Bytes, formatEther, parseEther, getAddress } from 'ethers';

export interface TokenParams {
  name: string;
  symbol: string;
  decimals: number;
  totalSupply: string;
  owner: string;
}

export interface NetworkConfig {
  chainId: number;
  name: string;
  rpcUrl: string;
  blockExplorer: string;
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
}

export const SUPPORTED_NETWORKS: Record<number, NetworkConfig> = {
  97: {
    chainId: 97,
    name: 'BSC Testnet',
    rpcUrl: 'https://data-seed-prebsc-1-s1.binance.org:8545/',
    blockExplorer: 'https://testnet.bscscan.com',
    nativeCurrency: {
      name: 'Binance Coin',
      symbol: 'tBNB',
      decimals: 18
    }
  },
  5: {
    chainId: 5,
    name: 'Goerli',
    rpcUrl: 'https://goerli.infura.io/v3/your-api-key',
    blockExplorer: 'https://goerli.etherscan.io',
    nativeCurrency: {
      name: 'Ethereum',
      symbol: 'ETH',
      decimals: 18
    }
  }
};

// Factory contract address (will be deployed later)
export const FACTORY_ADDRESS = '0x1234567890123456789012345678901234567890'; // Placeholder

// Factory ABI
export const FACTORY_ABI = [
  'function createToken((string,string,uint8,uint256,address),bytes32) payable returns (address)',
  'function predictTokenAddress((string,string,uint8,uint256,address),bytes32) view returns (address)',
  'function computeTokenAddress(bytes32,bytes32) view returns (address)',
  'function getTokenBytecodeHash((string,string,uint8,uint256,address)) pure returns (bytes32)',
  'function isTokenDeployed(bytes32) view returns (bool)',
  'function deploymentFee() view returns (uint256)',
  'function getUserTokens(address) view returns (bytes32[])',
  'event TokenCreated(address indexed,address indexed,string,string,bytes32 indexed)',
  'event PaymentReceived(address indexed,uint256,bytes32 indexed)'
];

// Token ABI
export const TOKEN_ABI = [
  'function name() view returns (string)',
  'function symbol() view returns (string)',
  'function decimals() view returns (uint8)',
  'function totalSupply() view returns (uint256)',
  'function balanceOf(address) view returns (uint256)',
  'function owner() view returns (address)',
  'function transfer(address,uint256) returns (bool)',
  'function mint(address,uint256)',
  'function burn(uint256)',
  'event Transfer(address indexed,address indexed,uint256)'
];

export class Web3Service {
  private provider: BrowserProvider | null = null;
  private factoryContract: Contract | null = null;

  async connect(): Promise<{ address: string; chainId: number } | null> {
    if (typeof window === 'undefined' || !window.ethereum) {
      throw new Error('MetaMask not found');
    }

    try {
      // Request account access
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      
      this.provider = new BrowserProvider(window.ethereum);
      const signer = await this.provider.getSigner();
      const address = await signer.getAddress();
      const network = await this.provider.getNetwork();

      // Initialize factory contract
      this.factoryContract = new Contract(FACTORY_ADDRESS, FACTORY_ABI, signer);

      return { address, chainId: Number(network.chainId) };
    } catch (error) {
      console.error('Connection error:', error);
      return null;
    }
  }

  async switchNetwork(chainId: number): Promise<boolean> {
    if (!window.ethereum) return false;

    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${chainId.toString(16)}` }],
      });
      return true;
    } catch (error) {
      console.error('Network switch error:', error);
      return false;
    }
  }

  async addNetwork(config: NetworkConfig): Promise<boolean> {
    if (!window.ethereum) return false;

    try {
      await window.ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [{
          chainId: `0x${config.chainId.toString(16)}`,
          chainName: config.name,
          nativeCurrency: config.nativeCurrency,
          rpcUrls: [config.rpcUrl],
          blockExplorerUrls: [config.blockExplorer],
        }],
      });
      return true;
    } catch (error) {
      console.error('Add network error:', error);
      return false;
    }
  }

  computeCreate2Address(deployerAddress: string, salt: string, bytecodeHash: string): string {
    const saltHex = salt.padStart(64, '0');
    
    const constructorArgs = ethers.concat([
      '0xff',
      deployerAddress,
      '0x' + saltHex,
      bytecodeHash
    ]);
    
    const addressHash = keccak256(constructorArgs);
    return getAddress('0x' + addressHash.slice(-40));
  }

  generateSalt(input: string): string {
    return keccak256(toUtf8Bytes(input));
  }

  async predictTokenAddress(params: TokenParams, salt: string): Promise<string | null> {
    if (!this.factoryContract) return null;

    try {
      const address = await this.factoryContract.predictTokenAddress(params, salt);
      return address;
    } catch (error) {
      console.error('Predict address error:', error);
      return null;
    }
  }

  async createToken(params: TokenParams, salt: string, paymentAmount: string): Promise<string | null> {
    if (!this.factoryContract) return null;

    try {
      const tx = await this.factoryContract.createToken(params, salt, {
        value: parseEther(paymentAmount)
      });
      
      const receipt = await tx.wait();
      const event = receipt?.logs?.find((log: any) => {
        try {
          const parsed = this.factoryContract?.interface.parseLog(log);
          return parsed?.name === 'TokenCreated';
        } catch {
          return false;
        }
      });
      
      if (event) {
        const parsed = this.factoryContract.interface.parseLog(event);
        return parsed?.args?.tokenAddress || null;
      }
      
      return null;
    } catch (error) {
      console.error('Create token error:', error);
      return null;
    }
  }

  async getDeploymentFee(): Promise<string | null> {
    if (!this.factoryContract) return null;

    try {
      const fee = await this.factoryContract.deploymentFee();
      return formatEther(fee);
    } catch (error) {
      console.error('Get deployment fee error:', error);
      return null;
    }
  }

  async getUserTokens(userAddress: string): Promise<string[] | null> {
    if (!this.factoryContract) return null;

    try {
      const salts = await this.factoryContract.getUserTokens(userAddress);
      return salts;
    } catch (error) {
      console.error('Get user tokens error:', error);
      return null;
    }
  }

  formatAddress(address: string): string {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  }

  isValidAddress(address: string): boolean {
    return isAddress(address);
  }
}

// Global instance
export const web3Service = new Web3Service();

// Utility functions
export function findSaltForPattern(
  pattern: string,
  deployerAddress: string,
  bytecodeHash: string,
  maxAttempts: number = 10000
): { salt: string; address: string } | null {
  const web3 = new Web3Service();
  
  for (let i = 0; i < maxAttempts; i++) {
    const salt = keccak256(
      toUtf8Bytes(`search_${pattern}_${i}`)
    );
    
    const address = web3.computeCreate2Address(deployerAddress, salt, bytecodeHash);
    
    if (address.toLowerCase().includes(pattern.toLowerCase())) {
      return { salt, address };
    }
  }
  
  return null;
}

// TypeScript declarations
declare global {
  interface Window {
    ethereum?: any;
  }
}
