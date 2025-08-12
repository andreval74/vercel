
"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/contexts/language-context';
import { useWeb3 } from '@/contexts/web3-context';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { 
  Wallet, 
  Globe, 
  ChevronDown, 
  Home, 
  Plus, 
  LayoutDashboard, 
  Settings,
  Copy,
  ExternalLink
} from 'lucide-react';
import toast from 'react-hot-toast';

export function Header() {
  const { language, setLanguage, t } = useLanguage();
  const { account, chainId, isConnected, isConnecting, connect, disconnect } = useWeb3();

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const copyAddress = () => {
    if (account) {
      navigator.clipboard.writeText(account);
      toast.success(t('common.copied'));
    }
  };

  const openExplorer = () => {
    if (account && chainId === 97) {
      window.open(`https://testnet.bscscan.com/address/${account}`, '_blank');
    }
  };

  const getNetworkName = (chainId: number | null) => {
    switch (chainId) {
      case 97: return 'BSC Testnet';
      case 56: return 'BSC Mainnet';
      case 5: return 'Goerli';
      case 1: return 'Ethereum';
      default: return 'Unknown Network';
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-800 bg-black/95 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-amber-500 to-yellow-500 rounded-lg flex items-center justify-center">
              <span className="text-black font-bold text-sm">SC</span>
            </div>
            <span className="font-bold text-xl text-white">SCCafé</span>
            <Badge variant="outline" className="text-xs border-amber-500 text-amber-500">
              CREATE2
            </Badge>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              href="/" 
              className="flex items-center space-x-1 text-gray-300 hover:text-white transition-colors"
            >
              <Home size={18} />
              <span>{t('nav.home')}</span>
            </Link>
            <Link 
              href="/create" 
              className="flex items-center space-x-1 text-gray-300 hover:text-white transition-colors"
            >
              <Plus size={18} />
              <span>{t('nav.create')}</span>
            </Link>
            <Link 
              href="/dashboard" 
              className="flex items-center space-x-1 text-gray-300 hover:text-white transition-colors"
            >
              <LayoutDashboard size={18} />
              <span>{t('nav.dashboard')}</span>
            </Link>
            <Link 
              href="/admin" 
              className="flex items-center space-x-1 text-gray-300 hover:text-white transition-colors"
            >
              <Settings size={18} />
              <span>{t('nav.admin')}</span>
            </Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            {/* Language Selector */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="border-gray-700">
                  <Globe size={16} />
                  <span className="ml-1 uppercase">{language}</span>
                  <ChevronDown size={14} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-gray-900 border-gray-700">
                <DropdownMenuItem 
                  onClick={() => setLanguage('pt')}
                  className="hover:bg-gray-800 text-white"
                >
                  🇧🇷 Português
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => setLanguage('en')}
                  className="hover:bg-gray-800 text-white"
                >
                  🇺🇸 English
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => setLanguage('cn')}
                  className="hover:bg-gray-800 text-white"
                >
                  🇨🇳 中文
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Wallet Connection */}
            {isConnected && account ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button className="bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-black font-medium">
                    <Wallet size={16} />
                    <span className="ml-2">{formatAddress(account)}</span>
                    {chainId && (
                      <Badge variant="secondary" className="ml-2 text-xs">
                        {getNetworkName(chainId)}
                      </Badge>
                    )}
                    <ChevronDown size={14} className="ml-1" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-gray-900 border-gray-700 w-64">
                  <div className="px-3 py-2 border-b border-gray-700">
                    <p className="text-sm text-gray-400">Connected Account</p>
                    <p className="text-sm font-mono text-white">{account}</p>
                  </div>
                  <DropdownMenuItem 
                    onClick={copyAddress}
                    className="hover:bg-gray-800 text-white cursor-pointer"
                  >
                    <Copy size={16} />
                    <span className="ml-2">{t('common.copy')}</span>
                  </DropdownMenuItem>
                  {chainId === 97 && (
                    <DropdownMenuItem 
                      onClick={openExplorer}
                      className="hover:bg-gray-800 text-white cursor-pointer"
                    >
                      <ExternalLink size={16} />
                      <span className="ml-2">View on BscScan</span>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem 
                    onClick={disconnect}
                    className="hover:bg-gray-800 text-red-400 cursor-pointer"
                  >
                    <Wallet size={16} />
                    <span className="ml-2">{t('nav.disconnect')}</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button 
                onClick={connect}
                disabled={isConnecting}
                className="bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-black font-medium"
              >
                <Wallet size={16} />
                <span className="ml-2">
                  {isConnecting ? t('web3.connecting') : t('nav.connect')}
                </span>
              </Button>
            )}
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden border-t border-gray-800 py-2">
          <nav className="flex items-center justify-around">
            <Link href="/" className="flex flex-col items-center space-y-1 text-xs text-gray-300 hover:text-white">
              <Home size={20} />
              <span>{t('nav.home')}</span>
            </Link>
            <Link href="/create" className="flex flex-col items-center space-y-1 text-xs text-gray-300 hover:text-white">
              <Plus size={20} />
              <span>{t('nav.create')}</span>
            </Link>
            <Link href="/dashboard" className="flex flex-col items-center space-y-1 text-xs text-gray-300 hover:text-white">
              <LayoutDashboard size={20} />
              <span>{t('nav.dashboard')}</span>
            </Link>
            <Link href="/admin" className="flex flex-col items-center space-y-1 text-xs text-gray-300 hover:text-white">
              <Settings size={20} />
              <span>{t('nav.admin')}</span>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
