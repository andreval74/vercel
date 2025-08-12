
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { useWeb3 } from '../../contexts/Web3Context';
import { Menu, X, Globe, Wallet, AlertTriangle } from 'lucide-react';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const { t, i18n } = useTranslation();
  const { state: web3State, connectWallet, disconnectWallet, switchToBSCTestnet } = useWeb3();

  const languages = [
    { code: 'pt', name: 'Português', flag: '🇧🇷' },
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'cn', name: '中文', flag: '🇨🇳' },
  ];

  const changeLanguage = (langCode: string) => {
    i18n.changeLanguage(langCode);
    setIsLanguageOpen(false);
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <header className="bg-card/50 backdrop-blur-sm border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">SC</span>
              </div>
              <span className="text-xl font-bold gradient-text">SCCafé</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-muted-foreground hover:text-primary transition-colors">
              {t('home')}
            </Link>
            <Link href="/create" className="text-muted-foreground hover:text-primary transition-colors">
              {t('createToken')}
            </Link>
            <Link href="/dashboard" className="text-muted-foreground hover:text-primary transition-colors">
              {t('dashboard')}
            </Link>
            <Link href="/admin" className="text-muted-foreground hover:text-primary transition-colors">
              {t('admin')}
            </Link>
          </nav>

          {/* Right side actions */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Language Selector */}
            <div className="relative">
              <button
                onClick={() => setIsLanguageOpen(!isLanguageOpen)}
                className="flex items-center space-x-1 text-muted-foreground hover:text-primary transition-colors"
              >
                <Globe className="w-4 h-4" />
                <span className="text-sm">
                  {languages.find(lang => lang.code === i18n.language)?.flag}
                </span>
              </button>
              
              {isLanguageOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-card border border-border rounded-lg shadow-lg z-50">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => changeLanguage(lang.code)}
                      className="w-full px-4 py-2 text-left hover:bg-accent transition-colors flex items-center space-x-2"
                    >
                      <span>{lang.flag}</span>
                      <span className="text-sm">{lang.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Network Warning */}
            {web3State.isConnected && !web3State.isCorrectNetwork && (
              <button
                onClick={switchToBSCTestnet}
                className="flex items-center space-x-2 text-destructive hover:text-destructive/80 transition-colors"
              >
                <AlertTriangle className="w-4 h-4" />
                <span className="text-sm">{t('switchNetwork')}</span>
              </button>
            )}

            {/* Wallet Connection */}
            {web3State.isConnected ? (
              <div className="flex items-center space-x-2">
                <div className="network-indicator">
                  <div className="flex items-center space-x-2 bg-secondary px-3 py-2 rounded-lg">
                    <Wallet className="w-4 h-4 text-primary" />
                    <span className="text-sm font-mono">
                      {formatAddress(web3State.account!)}
                    </span>
                  </div>
                </div>
                <button
                  onClick={disconnectWallet}
                  className="text-sm text-muted-foreground hover:text-destructive transition-colors"
                >
                  {t('disconnect')}
                </button>
              </div>
            ) : (
              <button
                onClick={connectWallet}
                className="btn-primary flex items-center space-x-2"
                disabled={web3State.isLoading}
              >
                {web3State.isLoading ? (
                  <div className="spinner" />
                ) : (
                  <Wallet className="w-4 h-4" />
                )}
                <span>{t('connectWallet')}</span>
              </button>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-muted-foreground hover:text-primary transition-colors"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <nav className="flex flex-col space-y-4">
              <Link 
                href="/" 
                className="text-muted-foreground hover:text-primary transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                {t('home')}
              </Link>
              <Link 
                href="/create" 
                className="text-muted-foreground hover:text-primary transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                {t('createToken')}
              </Link>
              <Link 
                href="/dashboard" 
                className="text-muted-foreground hover:text-primary transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                {t('dashboard')}
              </Link>
              <Link 
                href="/admin" 
                className="text-muted-foreground hover:text-primary transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                {t('admin')}
              </Link>
              
              {/* Mobile Wallet Section */}
              <div className="pt-4 border-t border-border">
                {web3State.isConnected ? (
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 text-sm">
                      <Wallet className="w-4 h-4 text-primary" />
                      <span className="font-mono">{formatAddress(web3State.account!)}</span>
                    </div>
                    {!web3State.isCorrectNetwork && (
                      <button
                        onClick={switchToBSCTestnet}
                        className="text-destructive text-sm hover:text-destructive/80 transition-colors"
                      >
                        {t('switchNetwork')}
                      </button>
                    )}
                    <button
                      onClick={disconnectWallet}
                      className="text-sm text-muted-foreground hover:text-destructive transition-colors"
                    >
                      {t('disconnect')}
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={connectWallet}
                    className="btn-primary w-full flex items-center justify-center space-x-2"
                    disabled={web3State.isLoading}
                  >
                    {web3State.isLoading ? (
                      <div className="spinner" />
                    ) : (
                      <Wallet className="w-4 h-4" />
                    )}
                    <span>{t('connectWallet')}</span>
                  </button>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
