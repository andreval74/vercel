
'use client';

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useWeb3 } from '../../contexts/Web3Context';
import { useTokenFactory } from '../../hooks/useTokenFactory';
import { Header } from '../../components/layout/Header';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Switch } from '../../components/ui/switch';
import { Separator } from '../../components/ui/separator';
import { Alert, AlertDescription } from '../../components/ui/alert';
import { 
  Wallet, 
  AlertTriangle, 
  Info, 
  Copy, 
  CheckCircle, 
  Loader2,
  Sparkles,
  DollarSign 
} from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function CreateTokenPage() {
  const { t } = useTranslation();
  const { state: web3State, connectWallet } = useWeb3();
  const { 
    isDeploying, 
    predictedAddress, 
    deploymentCost, 
    deployToken, 
    predictTokenAddress, 
    getDeploymentCost 
  } = useTokenFactory();

  const [formData, setFormData] = useState({
    name: '',
    symbol: '',
    totalSupply: '1000000',
    decimals: 18,
    customSuffix: '',
    useCustomSuffix: false,
  });

  const [addressPredicted, setAddressPredicted] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  // Update deployment cost when suffix type changes
  useEffect(() => {
    getDeploymentCost(formData.useCustomSuffix);
  }, [formData.useCustomSuffix]);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    setAddressPredicted(false);
    setShowPreview(false);
  };

  const handlePredictAddress = async () => {
    if (!web3State.isConnected) {
      toast.error(t('connectWalletFirst'));
      return;
    }

    if (formData.useCustomSuffix && (!formData.customSuffix || formData.customSuffix.length > 4)) {
      toast.error('Custom suffix must be 1-4 characters');
      return;
    }

    await predictTokenAddress(formData);
    setAddressPredicted(true);
    setShowPreview(true);
  };

  const handleDeploy = async () => {
    if (!web3State.isConnected) {
      toast.error(t('connectWalletFirst'));
      return;
    }

    if (!web3State.isCorrectNetwork) {
      toast.error(t('invalidNetwork'));
      return;
    }

    const result = await deployToken(formData);
    if (result) {
      // Reset form
      setFormData({
        name: '',
        symbol: '',
        totalSupply: '1000000',
        decimals: 18,
        customSuffix: '',
        useCustomSuffix: false,
      });
      setAddressPredicted(false);
      setShowPreview(false);
    }
  };

  const copyAddress = () => {
    if (predictedAddress) {
      navigator.clipboard.writeText(predictedAddress);
      toast.success('Address copied to clipboard!');
    }
  };

  const isFormValid = () => {
    return (
      formData.name &&
      formData.symbol &&
      formData.totalSupply &&
      formData.decimals >= 1 &&
      formData.decimals <= 18 &&
      (!formData.useCustomSuffix || (formData.customSuffix && formData.customSuffix.length <= 4))
    );
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
                You need to connect your wallet to create tokens with custom addresses.
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
      
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 gradient-text">{t('createTokenTitle')}</h1>
          <p className="text-xl text-muted-foreground">
            Create your token with a custom address using CREATE2 technology
          </p>
        </div>

        {!web3State.isCorrectNetwork && (
          <Alert className="mb-6 border-destructive/50 bg-destructive/10">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription className="text-destructive">
              {t('invalidNetwork')}
            </AlertDescription>
          </Alert>
        )}

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Token Configuration */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-primary" />
                <span>Token Configuration</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Basic Token Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">{t('tokenName')}</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="My Awesome Token"
                  />
                </div>
                <div>
                  <Label htmlFor="symbol">{t('tokenSymbol')}</Label>
                  <Input
                    id="symbol"
                    value={formData.symbol}
                    onChange={(e) => handleInputChange('symbol', e.target.value.toUpperCase())}
                    placeholder="MAT"
                    maxLength={10}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="totalSupply">{t('totalSupply')}</Label>
                  <Input
                    id="totalSupply"
                    type="number"
                    value={formData.totalSupply}
                    onChange={(e) => handleInputChange('totalSupply', e.target.value)}
                    min="1"
                  />
                </div>
                <div>
                  <Label htmlFor="decimals">{t('decimals')}</Label>
                  <Input
                    id="decimals"
                    type="number"
                    value={formData.decimals}
                    onChange={(e) => handleInputChange('decimals', parseInt(e.target.value))}
                    min="1"
                    max="18"
                  />
                </div>
              </div>

              <Separator />

              {/* Custom Suffix Configuration */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">Address Customization</h3>
                    <p className="text-sm text-muted-foreground">
                      Customize the ending of your token address
                    </p>
                  </div>
                  <Switch
                    checked={formData.useCustomSuffix}
                    onCheckedChange={(checked) => handleInputChange('useCustomSuffix', checked)}
                  />
                </div>

                {formData.useCustomSuffix ? (
                  <div>
                    <Label htmlFor="customSuffix">{t('customSuffix')}</Label>
                    <Input
                      id="customSuffix"
                      value={formData.customSuffix}
                      onChange={(e) => handleInputChange('customSuffix', e.target.value.toLowerCase())}
                      placeholder="1234"
                      maxLength={4}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Maximum 4 characters (letters and numbers only)
                    </p>
                  </div>
                ) : (
                  <Alert>
                    <Info className="h-4 w-4" />
                    <AlertDescription>
                      Using standard "cafe" suffix - lower deployment cost
                    </AlertDescription>
                  </Alert>
                )}
              </div>

              <Separator />

              {/* Deployment Cost */}
              <div className="bg-secondary/20 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <DollarSign className="w-5 h-5 text-primary" />
                    <span className="font-semibold">Deployment Cost</span>
                  </div>
                  <span className="text-2xl font-bold text-primary">
                    {deploymentCost} BNB
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  {formData.useCustomSuffix ? 'Custom suffix fee' : 'Standard deployment fee'}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <Button
                  onClick={handlePredictAddress}
                  variant="outline"
                  className="w-full"
                  disabled={!isFormValid() || !web3State.isCorrectNetwork}
                >
                  {t('predictAddress')}
                </Button>

                <Button
                  onClick={handleDeploy}
                  className="w-full"
                  disabled={
                    !isFormValid() || 
                    !addressPredicted || 
                    isDeploying || 
                    !web3State.isCorrectNetwork
                  }
                >
                  {isDeploying ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Deploying...
                    </>
                  ) : (
                    t('deployToken')
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Preview */}
          <Card>
            <CardHeader>
              <CardTitle>Token Preview</CardTitle>
            </CardHeader>
            <CardContent>
              {showPreview ? (
                <div className="space-y-6">
                  {/* Token Details */}
                  <div className="bg-secondary/20 rounded-lg p-6 space-y-4">
                    <div className="text-center">
                      <h3 className="text-2xl font-bold gradient-text">{formData.name}</h3>
                      <p className="text-muted-foreground">{formData.symbol}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Total Supply:</span>
                        <p className="font-semibold">
                          {Number(formData.totalSupply).toLocaleString()} {formData.symbol}
                        </p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Decimals:</span>
                        <p className="font-semibold">{formData.decimals}</p>
                      </div>
                    </div>
                  </div>

                  {/* Predicted Address */}
                  {predictedAddress && (
                    <div className="space-y-3">
                      <h4 className="font-semibold flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span>Predicted Address</span>
                      </h4>
                      <div className="bg-card border border-border rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <code className="text-sm font-mono text-primary break-all">
                            {predictedAddress}
                          </code>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={copyAddress}
                            className="ml-2 flex-shrink-0"
                          >
                            <Copy className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      
                      {formData.useCustomSuffix && formData.customSuffix && (
                        <p className="text-xs text-muted-foreground">
                          Address ending with custom suffix: 
                          <span className="text-primary font-mono ml-1">
                            ...{formData.customSuffix}
                          </span>
                        </p>
                      )}
                    </div>
                  )}

                  {/* Deployment Summary */}
                  <div className="border-t border-border pt-4">
                    <h4 className="font-semibold mb-3">Deployment Summary</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Network:</span>
                        <span>BSC Testnet</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Technology:</span>
                        <span>CREATE2</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Verification:</span>
                        <span className="text-green-500">Automatic</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Cost:</span>
                        <span className="font-semibold">{deploymentCost} BNB</span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <Sparkles className="w-16 h-16 text-muted-foreground/50 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-muted-foreground mb-2">
                    Preview Your Token
                  </h3>
                  <p className="text-muted-foreground">
                    Fill out the form and predict address to see your token preview
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
