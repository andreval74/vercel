
'use client';

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useWeb3 } from '../../contexts/Web3Context';
import { Header } from '../../components/layout/Header';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Badge } from '../../components/ui/badge';
import { Separator } from '../../components/ui/separator';
import { Alert, AlertDescription } from '../../components/ui/alert';
import { 
  Shield, 
  Settings, 
  DollarSign, 
  Users, 
  BarChart3,
  AlertTriangle,
  Check,
  TrendingUp,
  Coins,
  Network,
  Lock
} from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function AdminPage() {
  const { t } = useTranslation();
  const { state: web3State, connectWallet } = useWeb3();
  
  const [adminSettings, setAdminSettings] = useState({
    standardFee: '0.01',
    customFee: '0.05',
    feeCollector: '0x1234...5678',
    maxSuffixLength: 4,
    isPaused: false,
  });

  const [stats] = useState({
    totalTokensDeployed: 127,
    totalRevenue: '12.45',
    activeUsers: 89,
    customSuffixTokens: 45,
  });

  // Mock admin check - in production this would check against the contract owner
  const isAdmin = web3State.account === '0x1234567890123456789012345678901234567890';

  const updateFees = () => {
    toast.success('Fees updated successfully');
  };

  const pauseContract = () => {
    setAdminSettings(prev => ({ ...prev, isPaused: !prev.isPaused }));
    toast.success(adminSettings.isPaused ? 'Contract resumed' : 'Contract paused');
  };

  const withdrawFees = () => {
    toast.success('Fees withdrawn successfully');
  };

  if (!web3State.isConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-background/90">
        <Header />
        <div className="max-w-2xl mx-auto px-4 py-20">
          <Card className="text-center">
            <CardContent className="p-12">
              <Shield className="w-16 h-16 text-primary mx-auto mb-6" />
              <h2 className="text-2xl font-bold mb-4">Admin Access Required</h2>
              <p className="text-muted-foreground mb-8">
                Connect your wallet to access the admin panel.
              </p>
              <Button onClick={connectWallet} size="lg" className="w-full max-w-xs">
                Connect Wallet
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-background/90">
        <Header />
        <div className="max-w-2xl mx-auto px-4 py-20">
          <Card className="text-center">
            <CardContent className="p-12">
              <Lock className="w-16 h-16 text-destructive mx-auto mb-6" />
              <h2 className="text-2xl font-bold mb-4">Access Denied</h2>
              <p className="text-muted-foreground mb-8">
                You don't have admin permissions to access this page.
              </p>
              <Badge variant="destructive" className="text-sm">
                Admin Only
              </Badge>
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
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2 gradient-text">Admin Panel</h1>
            <p className="text-muted-foreground">
              Manage SCCafé token factory settings and monitor platform activity
            </p>
          </div>
          <Badge variant="default" className="bg-green-500/10 text-green-400 border-green-500/20">
            <Shield className="w-4 h-4 mr-1" />
            Admin Access
          </Badge>
        </div>

        {/* Contract Status Alert */}
        {adminSettings.isPaused && (
          <Alert className="mb-6 border-destructive/50 bg-destructive/10">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription className="text-destructive">
              Contract is currently paused. No new tokens can be deployed.
            </AlertDescription>
          </Alert>
        )}

        {/* Platform Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">Total Deployed</p>
                  <p className="text-2xl font-bold">{stats.totalTokensDeployed}</p>
                </div>
                <Coins className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">Total Revenue</p>
                  <p className="text-2xl font-bold">{stats.totalRevenue} BNB</p>
                </div>
                <DollarSign className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">Active Users</p>
                  <p className="text-2xl font-bold">{stats.activeUsers}</p>
                </div>
                <Users className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">Custom Suffixes</p>
                  <p className="text-2xl font-bold">{stats.customSuffixTokens}</p>
                </div>
                <TrendingUp className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Settings className="w-5 h-5" />
                <span>Factory Settings</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Fee Settings */}
              <div className="space-y-4">
                <h3 className="font-semibold">Deployment Fees</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="standardFee">Standard Fee (BNB)</Label>
                    <Input
                      id="standardFee"
                      type="number"
                      step="0.001"
                      value={adminSettings.standardFee}
                      onChange={(e) => setAdminSettings(prev => ({
                        ...prev,
                        standardFee: e.target.value
                      }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="customFee">Custom Fee (BNB)</Label>
                    <Input
                      id="customFee"
                      type="number"
                      step="0.001"
                      value={adminSettings.customFee}
                      onChange={(e) => setAdminSettings(prev => ({
                        ...prev,
                        customFee: e.target.value
                      }))}
                    />
                  </div>
                </div>
                <Button onClick={updateFees} className="w-full">
                  Update Fees
                </Button>
              </div>

              <Separator />

              {/* Fee Collector */}
              <div className="space-y-4">
                <h3 className="font-semibold">Fee Collector Address</h3>
                <Input
                  value={adminSettings.feeCollector}
                  onChange={(e) => setAdminSettings(prev => ({
                    ...prev,
                    feeCollector: e.target.value
                  }))}
                  placeholder="0x..."
                />
                <Button variant="outline" className="w-full">
                  Update Fee Collector
                </Button>
              </div>

              <Separator />

              {/* Contract Controls */}
              <div className="space-y-4">
                <h3 className="font-semibold">Contract Controls</h3>
                <div className="flex items-center justify-between">
                  <span>Contract Status</span>
                  <Badge variant={adminSettings.isPaused ? "destructive" : "default"}>
                    {adminSettings.isPaused ? 'Paused' : 'Active'}
                  </Badge>
                </div>
                <Button 
                  onClick={pauseContract}
                  variant={adminSettings.isPaused ? "default" : "destructive"}
                  className="w-full"
                >
                  {adminSettings.isPaused ? 'Resume Contract' : 'Pause Contract'}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Financial Management */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <DollarSign className="w-5 h-5" />
                <span>Financial Management</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Revenue Overview */}
              <div className="space-y-4">
                <h3 className="font-semibold">Revenue Overview</h3>
                <div className="bg-secondary/20 rounded-lg p-4 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Standard Deployments</span>
                    <span className="font-semibold">8.2 BNB</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Custom Suffixes</span>
                    <span className="font-semibold">4.25 BNB</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">Total Revenue</span>
                    <span className="font-bold text-primary">{stats.totalRevenue} BNB</span>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Withdraw Fees */}
              <div className="space-y-4">
                <h3 className="font-semibold">Fee Withdrawal</h3>
                <p className="text-sm text-muted-foreground">
                  Withdraw accumulated fees to the fee collector address.
                </p>
                <Button onClick={withdrawFees} className="w-full" variant="outline">
                  Withdraw Fees
                </Button>
              </div>

              <Separator />

              {/* Emergency Controls */}
              <div className="space-y-4">
                <h3 className="font-semibold text-destructive">Emergency Controls</h3>
                <p className="text-sm text-muted-foreground">
                  Emergency withdrawal of all contract funds.
                </p>
                <Button variant="destructive" className="w-full">
                  Emergency Withdraw
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 className="w-5 h-5" />
              <span>Recent Activity</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                {
                  action: 'Token Deployed',
                  details: 'StandardToken (STD) with cafe suffix',
                  user: '0x1234...5678',
                  fee: '0.01 BNB',
                  time: '2 minutes ago',
                  status: 'success'
                },
                {
                  action: 'Custom Deployment',
                  details: 'AwesomeToken (AWE) with 1337 suffix',
                  user: '0x9876...4321',
                  fee: '0.05 BNB',
                  time: '15 minutes ago',
                  status: 'success'
                },
                {
                  action: 'Failed Deployment',
                  details: 'Insufficient fee provided',
                  user: '0x5555...9999',
                  fee: '0.005 BNB',
                  time: '1 hour ago',
                  status: 'error'
                },
              ].map((activity, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-secondary/20 rounded-lg">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-semibold">{activity.action}</span>
                      <Badge 
                        variant={activity.status === 'success' ? 'default' : 'destructive'}
                        className={activity.status === 'success' ? 'bg-green-500/10 text-green-400 border-green-500/20' : ''}
                      >
                        {activity.status === 'success' ? (
                          <Check className="w-3 h-3 mr-1" />
                        ) : (
                          <AlertTriangle className="w-3 h-3 mr-1" />
                        )}
                        {activity.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{activity.details}</p>
                    <p className="text-xs text-muted-foreground">
                      User: {activity.user} • Fee: {activity.fee}
                    </p>
                  </div>
                  <span className="text-xs text-muted-foreground">{activity.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
