
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  pt: {
    translation: {
      // Navigation
      home: 'Início',
      createToken: 'Criar Token',
      dashboard: 'Dashboard',
      admin: 'Admin',
      
      // Wallet
      connectWallet: 'Conectar Carteira',
      disconnect: 'Desconectar',
      walletConnected: 'Carteira Conectada',
      switchNetwork: 'Trocar Rede',
      
      // Home
      welcomeTitle: 'Bem-vindo ao SCCafé',
      welcomeSubtitle: 'Crie tokens com endereços personalizados usando tecnologia CREATE2',
      heroTitle: 'Endereços Personalizados para Seus Tokens',
      heroDescription: 'Nossa tecnologia CREATE2 permite criar tokens com endereços únicos e memoráveis. Escolha seu sufixo personalizado ou use nosso padrão "cafe".',
      
      // Features
      customAddresses: 'Endereços Personalizados',
      customAddressesDesc: 'Crie tokens com endereços que terminam com seu sufixo escolhido',
      quickDeploy: 'Deploy Rápido',
      quickDeployDesc: 'Deploy verificado automaticamente na blockchain',
      lowCost: 'Baixo Custo',
      lowCostDesc: 'Preços competitivos para criação de tokens',
      
      // Create Token
      createTokenTitle: 'Criar Novo Token',
      tokenName: 'Nome do Token',
      tokenSymbol: 'Símbolo do Token',
      totalSupply: 'Supply Total',
      decimals: 'Decimais',
      customSuffix: 'Sufixo Personalizado',
      customSuffixPlaceholder: 'Ex: 1234, abcd (máx 4 chars)',
      useStandardSuffix: 'Usar sufixo padrão "cafe"',
      predictAddress: 'Prever Endereço',
      deployToken: 'Deploy Token',
      
      // Fees
      standardFee: 'Taxa Padrão',
      customFee: 'Taxa Personalizada',
      
      // Dashboard
      dashboardTitle: 'Meus Tokens',
      noTokens: 'Nenhum token criado ainda',
      tokenAddress: 'Endereço',
      tokenTotalSupply: 'Supply Total',
      
      // Common
      loading: 'Carregando...',
      error: 'Erro',
      success: 'Sucesso',
      close: 'Fechar',
      submit: 'Enviar',
      cancel: 'Cancelar',
      
      // Errors
      connectWalletFirst: 'Conecte sua carteira primeiro',
      invalidNetwork: 'Rede inválida. Mude para BSC Testnet',
      transactionFailed: 'Transação falhou',
      insufficientFunds: 'Fundos insuficientes',
    }
  },
  en: {
    translation: {
      // Navigation
      home: 'Home',
      createToken: 'Create Token',
      dashboard: 'Dashboard',
      admin: 'Admin',
      
      // Wallet
      connectWallet: 'Connect Wallet',
      disconnect: 'Disconnect',
      walletConnected: 'Wallet Connected',
      switchNetwork: 'Switch Network',
      
      // Home
      welcomeTitle: 'Welcome to SCCafé',
      welcomeSubtitle: 'Create tokens with custom addresses using CREATE2 technology',
      heroTitle: 'Custom Addresses for Your Tokens',
      heroDescription: 'Our CREATE2 technology allows you to create tokens with unique and memorable addresses. Choose your custom suffix or use our standard "cafe".',
      
      // Features
      customAddresses: 'Custom Addresses',
      customAddressesDesc: 'Create tokens with addresses ending in your chosen suffix',
      quickDeploy: 'Quick Deploy',
      quickDeployDesc: 'Automatically verified deployment on blockchain',
      lowCost: 'Low Cost',
      lowCostDesc: 'Competitive prices for token creation',
      
      // Create Token
      createTokenTitle: 'Create New Token',
      tokenName: 'Token Name',
      tokenSymbol: 'Token Symbol',
      totalSupply: 'Total Supply',
      decimals: 'Decimals',
      customSuffix: 'Custom Suffix',
      customSuffixPlaceholder: 'Ex: 1234, abcd (max 4 chars)',
      useStandardSuffix: 'Use standard "cafe" suffix',
      predictAddress: 'Predict Address',
      deployToken: 'Deploy Token',
      
      // Fees
      standardFee: 'Standard Fee',
      customFee: 'Custom Fee',
      
      // Dashboard
      dashboardTitle: 'My Tokens',
      noTokens: 'No tokens created yet',
      tokenAddress: 'Address',
      tokenTotalSupply: 'Total Supply',
      
      // Common
      loading: 'Loading...',
      error: 'Error',
      success: 'Success',
      close: 'Close',
      submit: 'Submit',
      cancel: 'Cancel',
      
      // Errors
      connectWalletFirst: 'Connect your wallet first',
      invalidNetwork: 'Invalid network. Switch to BSC Testnet',
      transactionFailed: 'Transaction failed',
      insufficientFunds: 'Insufficient funds',
    }
  },
  cn: {
    translation: {
      // Navigation
      home: '主页',
      createToken: '创建代币',
      dashboard: '仪表板',
      admin: '管理员',
      
      // Wallet
      connectWallet: '连接钱包',
      disconnect: '断开连接',
      walletConnected: '钱包已连接',
      switchNetwork: '切换网络',
      
      // Home
      welcomeTitle: '欢迎来到SCCafé',
      welcomeSubtitle: '使用CREATE2技术创建自定义地址的代币',
      heroTitle: '为您的代币定制地址',
      heroDescription: '我们的CREATE2技术让您可以创建具有独特且易记地址的代币。选择您的自定义后缀或使用我们的标准"cafe"。',
      
      // Features
      customAddresses: '自定义地址',
      customAddressesDesc: '创建以您选择的后缀结尾的代币地址',
      quickDeploy: '快速部署',
      quickDeployDesc: '在区块链上自动验证部署',
      lowCost: '低成本',
      lowCostDesc: '代币创建的竞争性价格',
      
      // Create Token
      createTokenTitle: '创建新代币',
      tokenName: '代币名称',
      tokenSymbol: '代币符号',
      totalSupply: '总供应量',
      decimals: '小数位',
      customSuffix: '自定义后缀',
      customSuffixPlaceholder: '例如: 1234, abcd (最多4个字符)',
      useStandardSuffix: '使用标准"cafe"后缀',
      predictAddress: '预测地址',
      deployToken: '部署代币',
      
      // Fees
      standardFee: '标准费用',
      customFee: '自定义费用',
      
      // Dashboard
      dashboardTitle: '我的代币',
      noTokens: '尚未创建代币',
      tokenAddress: '地址',
      tokenTotalSupply: '总供应量',
      
      // Common
      loading: '加载中...',
      error: '错误',
      success: '成功',
      close: '关闭',
      submit: '提交',
      cancel: '取消',
      
      // Errors
      connectWalletFirst: '请先连接您的钱包',
      invalidNetwork: '网络无效。请切换到BSC测试网',
      transactionFailed: '交易失败',
      insufficientFunds: '资金不足',
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'pt',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
