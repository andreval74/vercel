
'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';
import { useWeb3 } from '../../contexts/Web3Context';
import { useTokens } from '../../contexts/TokenContext';
import { Header } from '../../components/layout/Header';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { 
  Wallet, 
  Plus, 
  ExternalLink, 
  Copy, 
  Coins,
  TrendingUp,
  Users,
  Calendar,
  BarChart3
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import Link from 'next/link';

export default function DashboardPage() {
  const { t } = useTranslation();
  const { state: web3State, connectWallet } = useWeb3();
  const { state: tokenState, refreshUserTokens } = useTokens();

  const copyAddress = (address: string) => {
    navigator.clipboard.writeText(address);
    toast.success('Address copied to clipboard!');
  };

  const openInExplorer = (address: string) => {
    const explorerUrl = web3State.chainId === 97 
      ? `https://testnet.bscscan.com/token/${address}`
      : `https://bscscan.com/token/${address}`;
    window.open(explorerUrl, '_blank');
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const formatNumber = (num: string) => {
    return Number(num).toLocaleString();
  };

  if (!web3State.isConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-background/90">
        <Header />
        <div className="max-w-2xl mx-auto px-4 py-20">
          <Card className="text-center">
            <CardContent className="p-12">
              <Wallet className="w-16 h-16 text-primary mx-auto mb-6" />
              <h2 className="text-2xl font-bold mb-4">{t('connectWalletFirst')}</h2>
              <p className="text-muted-foreground mb-8">
                Connect your wallet to view your token dashboard.
              </p>
              <Button onClick={connectWallet} size="lg" className="w-full max-w-xs">
                <Wallet className="w-5 h-5 mr-2" />
                {t('connectWallet')}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-background/90">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2 gradient-text">{t('dashboardTitle')}</h1>
            <p className="text-muted-foreground">
              Manage and monitor all your custom tokens in one place
            </p>
          </div>
          <Link href="/create">
            <Button className="mt-4 lg:mt-0">
              <Plus className="w-5 h-5 mr-2" />
              Create New Token
            </Button>
          </Link>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">Total Tokens</p>
                  <p className="text-2xl font-bold">{tokenState.userTokens.length}</p>
                </div>
                <Coins className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">Network</p>
                  <p className="text-2xl font-bold">
                    {web3State.chainId === 97 ? 'BSC Test' : 'BSC Main'}
                  </p>
                </div>
                <BarChart3 className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">Total Supply</p>
                  <p className="text-2xl font-bold">
                    {tokenState.userTokens.reduce((acc, token) => acc + Number(token.totalSupply), 0).toLocaleString()}
                  </p>
                </div>
                <TrendingUp className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">Custom Addresses</p>
                  <p className="text-2xl font-bold">
                    {tokenState.userTokens.filter(token => token.customSuffix && token.customSuffix !== 'cafe').length}
                  </p>
                </div>
                <Users className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tokens List */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Your Tokens</CardTitle>
              <Button variant="outline" onClick={refreshUserTokens} disabled={tokenState.isLoading}>
                {tokenState.isLoading ? 'Refreshing...' : 'Refresh'}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {tokenState.userTokens.length === 0 ? (
              <div className="text-center py-12">
                <Coins className="w-16 h-16 text-muted-foreground/50 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-muted-foreground mb-2">
                  {t('noTokens')}
                </h3>
                <p className="text-muted-foreground mb-6">
                  Create your first token with a custom address using CREATE2 technology.
                </p>
                <Link href="/create">
                  <Button>
                    <Plus className="w-5 h-5 mr-2" />
                    Create Your First Token
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {tokenState.userTokens.map((token) => (
                  <div
                    key={token.address}
                    className="bg-secondary/20 rounded-lg p-6 hover:bg-secondary/30 transition-colors"
                  >
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 items-center">
                      {/* Token Info */}
                      <div className="space-y-2">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                            <span className="text-primary font-bold text-sm">
                              {token.symbol.charAt(0)}
                            </span>
                          </div>
                          <div>
                            <h3 className="font-bold text-lg">{token.name}</h3>
                            <p className="text-muted-foreground text-sm">{token.symbol}</p>
                          </div>
                        </div>
                      </div>

                      {/* Address & Suffix */}
                      <div className="space-y-2">
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Contract Address</p>
                          <div className="flex items-center space-x-2">
                            <code className="text-sm font-mono bg-background px-2 py-1 rounded">
                              {formatAddress(token.address)}
                            </code>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => copyAddress(token.address)}
                            >
                              <Copy className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                        {token.customSuffix && (
                          <div>
                            <Badge variant="secondary" className="text-xs">
                              Suffix: {token.customSuffix}
                            </Badge>
                          </div>
                        )}
                      </div>

                      {/* Token Details */}
                      <div className="space-y-1">
                        <div className="text-sm">
                          <span className="text-muted-foreground">Supply: </span>
                          <span className="font-semibold">
                            {formatNumber(token.totalSupply)} {token.symbol}
                          </span>
                        </div>
                        <div className="text-sm">
                          <span className="text-muted-foreground">Decimals: </span>
                          <span>{token.decimals}</span>
                        </div>
                        <div className="text-sm flex items-center space-x-1">
                          <Calendar className="w-3 h-3 text-muted-foreground" />
                          <span className="text-muted-foreground">
                            {new Date(token.deployedAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-col space-y-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openInExplorer(token.address)}
                          className="w-full"
                        >
                          <ExternalLink className="w-4 h-4 mr-2" />
                          View Explorer
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyAddress(token.address)}
                          className="w-full"
                        >
                          <Copy className="w-4 h-4 mr-2" />
                          Copy Address
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 gap-6 mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Need Help?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Learn more about CREATE2 technology and custom token addresses.
              </p>
              <div className="space-y-2">
                <Button variant="outline" className="w-full" asChild>
                  <a href="#" target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Documentation
                  </a>
                </Button>
                <Button variant="outline" className="w-full" asChild>
                  <a href="#" target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Support
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Network Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Current Network:</span>
                  <Badge variant={web3State.isCorrectNetwork ? "default" : "destructive"}>
                    {web3State.chainId === 97 ? 'BSC Testnet' : 
                     web3State.chainId === 56 ? 'BSC Mainnet' : 
                     'Wrong Network'}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Wallet:</span>
                  <code className="text-sm font-mono">
                    {formatAddress(web3State.account!)}
                  </code>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Connection:</span>
                  <Badge variant="default" className="bg-green-500/10 text-green-400 border-green-500/20">
                    Connected
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
