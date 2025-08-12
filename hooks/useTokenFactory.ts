
import { useState } from 'react';
import { ethers } from 'ethers';
import { useWeb3 } from '../contexts/Web3Context';
import { useTokens } from '../contexts/TokenContext';
import { toast } from 'react-hot-toast';

// Contract ABI (simplified for now - in production this would be the full ABI)
const TOKEN_FACTORY_ABI = [
  "function deployStandardToken(string name, string symbol, uint256 totalSupply, uint8 decimals) external payable returns (address)",
  "function deployCustomToken(string name, string symbol, uint256 totalSupply, uint8 decimals, string customSuffix) external payable returns (address)",
  "function deployWithSalt(string name, string symbol, uint256 totalSupply, uint8 decimals, bytes32 salt) external payable returns (address)",
  "function findSaltForSuffix(string suffix) external view returns (bytes32)",
  "function predictTokenAddress(bytes32 salt) external view returns (address)",
  "function getUserTokens(address user) external view returns (address[])",
  "function STANDARD_FEE() external view returns (uint256)",
  "function CUSTOM_FEE() external view returns (uint256)",
  "event TokenDeployed(address indexed tokenAddress, string name, string symbol, uint256 totalSupply, address indexed creator, bytes32 salt, string customSuffix)"
];

// Mock contract address - in production this would be the deployed factory address
const FACTORY_ADDRESS = "0x1234567890123456789012345678901234567890"; // Replace with actual address

export interface TokenDeployParams {
  name: string;
  symbol: string;
  totalSupply: string;
  decimals: number;
  customSuffix?: string;
  useCustomSuffix: boolean;
}

export function useTokenFactory() {
  const [isDeploying, setIsDeploying] = useState(false);
  const [predictedAddress, setPredictedAddress] = useState<string | null>(null);
  const [deploymentCost, setDeploymentCost] = useState<string>('0');
  
  const { state: web3State } = useWeb3();
  const { addToken } = useTokens();

  const getFactoryContract = () => {
    if (!web3State.signer) {
      throw new Error('Wallet not connected');
    }
    return new ethers.Contract(FACTORY_ADDRESS, TOKEN_FACTORY_ABI, web3State.signer);
  };

  const predictTokenAddress = async (params: TokenDeployParams) => {
    try {
      if (!web3State.provider) return;

      const contract = getFactoryContract();
      
      let salt: string;
      if (params.useCustomSuffix && params.customSuffix) {
        salt = await contract.findSaltForSuffix(params.customSuffix);
      } else {
        salt = await contract.findSaltForSuffix("cafe");
      }
      
      const address = await contract.predictTokenAddress(salt);
      setPredictedAddress(address);
      
      return address;
    } catch (error: any) {
      console.error('Failed to predict address:', error);
      toast.error('Failed to predict address');
      return null;
    }
  };

  const getDeploymentCost = async (useCustomSuffix: boolean) => {
    try {
      if (!web3State.provider) return '0';

      const contract = getFactoryContract();
      
      const fee = useCustomSuffix 
        ? await contract.CUSTOM_FEE()
        : await contract.STANDARD_FEE();
      
      const feeInEther = ethers.formatEther(fee);
      setDeploymentCost(feeInEther);
      
      return feeInEther;
    } catch (error: any) {
      console.error('Failed to get deployment cost:', error);
      return '0';
    }
  };

  const deployToken = async (params: TokenDeployParams) => {
    if (!web3State.isConnected || !web3State.signer) {
      toast.error('Please connect your wallet first');
      return null;
    }

    if (!web3State.isCorrectNetwork) {
      toast.error('Please switch to BSC Testnet');
      return null;
    }

    try {
      setIsDeploying(true);
      
      const contract = getFactoryContract();
      
      // Convert totalSupply to wei (considering decimals)
      const totalSupplyWei = ethers.parseUnits(params.totalSupply, params.decimals);
      
      let tx;
      let fee;
      
      if (params.useCustomSuffix && params.customSuffix) {
        // Deploy with custom suffix
        fee = await contract.CUSTOM_FEE();
        tx = await contract.deployCustomToken(
          params.name,
          params.symbol,
          totalSupplyWei,
          params.decimals,
          params.customSuffix,
          { value: fee }
        );
      } else {
        // Deploy with standard "cafe" suffix
        fee = await contract.STANDARD_FEE();
        tx = await contract.deployStandardToken(
          params.name,
          params.symbol,
          totalSupplyWei,
          params.decimals,
          { value: fee }
        );
      }

      toast.loading('Deploying token...', { id: 'deploy' });
      
      const receipt = await tx.wait();
      
      // Find the TokenDeployed event
      const deployEvent = receipt.logs.find((log: any) => {
        try {
          return contract.interface.parseLog(log)?.name === 'TokenDeployed';
        } catch {
          return false;
        }
      });

      if (deployEvent) {
        const parsedEvent = contract.interface.parseLog(deployEvent);
        const tokenAddress = parsedEvent?.args[0];
        
        // Add token to context
        const tokenData = {
          address: tokenAddress,
          name: params.name,
          symbol: params.symbol,
          totalSupply: params.totalSupply,
          decimals: params.decimals,
          creator: web3State.account!,
          salt: parsedEvent?.args[5] || '',
          customSuffix: params.useCustomSuffix ? (params.customSuffix || '') : 'cafe',
          deployedAt: new Date().toISOString(),
        };
        
        addToken(tokenData);
        
        toast.success('Token deployed successfully!', { id: 'deploy' });
        
        return tokenData;
      } else {
        throw new Error('Token deployment event not found');
      }

    } catch (error: any) {
      console.error('Deployment failed:', error);
      
      let errorMessage = 'Token deployment failed';
      if (error.message.includes('insufficient funds')) {
        errorMessage = 'Insufficient funds for deployment';
      } else if (error.message.includes('user rejected')) {
        errorMessage = 'Transaction rejected by user';
      }
      
      toast.error(errorMessage, { id: 'deploy' });
      return null;
    } finally {
      setIsDeploying(false);
    }
  };

  const getUserTokens = async () => {
    try {
      if (!web3State.isConnected || !web3State.account) return [];

      const contract = getFactoryContract();
      const tokenAddresses = await contract.getUserTokens(web3State.account);
      
      return tokenAddresses;
    } catch (error: any) {
      console.error('Failed to fetch user tokens:', error);
      return [];
    }
  };

  return {
    isDeploying,
    predictedAddress,
    deploymentCost,
    deployToken,
    predictTokenAddress,
    getDeploymentCost,
    getUserTokens,
  };
}
