
'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';
import Link from 'next/link';
import { ArrowRight, Zap, Shield, DollarSign, Sparkles, Code, CheckCircle } from 'lucide-react';
import { Header } from '../components/layout/Header';

export default function HomePage() {
  const { t } = useTranslation();

  const features = [
    {
      icon: <Sparkles className="w-8 h-8 text-primary" />,
      title: t('customAddresses'),
      description: t('customAddressesDesc'),
    },
    {
      icon: <Zap className="w-8 h-8 text-primary" />,
      title: t('quickDeploy'),
      description: t('quickDeployDesc'),
    },
    {
      icon: <DollarSign className="w-8 h-8 text-primary" />,
      title: t('lowCost'),
      description: t('lowCostDesc'),
    },
  ];

  const steps = [
    {
      number: '01',
      title: 'Connect Wallet',
      description: 'Connect your MetaMask or Trust Wallet to get started',
    },
    {
      number: '02',
      title: 'Choose Suffix',
      description: 'Pick a custom 4-character suffix or use our standard "cafe"',
    },
    {
      number: '03',
      title: 'Deploy Token',
      description: 'Deploy your token with a memorable address using CREATE2',
    },
    {
      number: '04',
      title: 'Manage & Trade',
      description: 'Control your token through our dashboard and start trading',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-background/90">
      <Header />
      
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-primary/5" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 fade-in">
              <span className="gradient-text">{t('heroTitle')}</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto slide-up">
              {t('heroDescription')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center bounce-in">
              <Link href="/create" className="btn-primary flex items-center space-x-2 glow-gold">
                <span>{t('createToken')}</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link href="/dashboard" className="btn-outline">
                {t('dashboard')}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-card/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4 gradient-text">
              Why Choose SCCafé?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Revolutionary CREATE2 technology meets user-friendly interface
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="bg-card border border-border rounded-xl p-8 card-hover"
              >
                <div className="flex items-center justify-center w-16 h-16 bg-primary/10 rounded-lg mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold mb-4 text-foreground">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4 gradient-text">
              How It Works
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Create your token with a custom address in just 4 simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                {/* Connection Line */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-full w-full h-0.5 bg-gradient-to-r from-primary to-transparent transform translate-x-4" />
                )}
                
                <div className="bg-card border border-border rounded-xl p-6 card-hover">
                  <div className="flex items-center justify-center w-12 h-12 bg-primary text-primary-foreground rounded-lg font-bold text-lg mb-4">
                    {step.number}
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-foreground">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CREATE2 Technology Section */}
      <section className="py-20 bg-card/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-5xl font-bold mb-6 gradient-text">
                CREATE2 Technology
              </h2>
              <p className="text-xl text-muted-foreground mb-8">
                Unlike traditional token deployments that generate random addresses, 
                our CREATE2 implementation allows you to influence your token's address, 
                making it memorable and brandable.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-6 h-6 text-primary mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-foreground">Predictable Addresses</h4>
                    <p className="text-muted-foreground">Know your token address before deployment</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-6 h-6 text-primary mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-foreground">Custom Suffixes</h4>
                    <p className="text-muted-foreground">Choose up to 4 characters for your address ending</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-6 h-6 text-primary mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-foreground">Gas Efficient</h4>
                    <p className="text-muted-foreground">Optimized deployment process saves on fees</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-card border border-border rounded-xl p-8">
              <Code className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-2xl font-bold mb-4 text-foreground">Address Examples</h3>
              <div className="space-y-3 font-mono text-sm">
                <div className="bg-secondary/50 p-3 rounded-lg">
                  <div className="text-muted-foreground mb-1">Standard (cafe suffix):</div>
                  <div className="text-primary">0x1234567890123456789012345678901234<span className="text-yellow-400">cafe</span></div>
                </div>
                <div className="bg-secondary/50 p-3 rounded-lg">
                  <div className="text-muted-foreground mb-1">Custom (1337 suffix):</div>
                  <div className="text-primary">0x9876543210987654321098765432109876<span className="text-yellow-400">1337</span></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary/10 via-transparent to-primary/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-6 gradient-text">
            Ready to Create Your Token?
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join the revolution of custom token addresses. Deploy your first token with CREATE2 technology today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/create" className="btn-primary flex items-center space-x-2 glow-gold">
              <span>Start Creating</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link href="/dashboard" className="btn-secondary">
              View Dashboard
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-border bg-card/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">SC</span>
              </div>
              <span className="text-xl font-bold gradient-text">SCCafé</span>
            </div>
            <div className="flex items-center space-x-6">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                Documentation
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                GitHub
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                Support
              </a>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-border text-center text-muted-foreground">
            <p>&copy; 2024 SCCafé. All rights reserved. Built with CREATE2 technology.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
