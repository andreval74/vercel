
const { ethers } = require("hardhat");

async function main() {
  console.log("🚀 Starting SCCafé Token Factory deployment...");

  // Get the deployer account
  const [deployer] = await ethers.getSigners();
  console.log("📝 Deploying contracts with account:", deployer.address);

  // Get account balance
  const balance = await deployer.getBalance();
  console.log("💰 Account balance:", ethers.utils.formatEther(balance), "BNB");

  // Deploy TokenFactory
  console.log("\n📦 Deploying TokenFactory contract...");
  const TokenFactory = await ethers.getContractFactory("TokenFactory");
  const tokenFactory = await TokenFactory.deploy();

  await tokenFactory.deployed();
  console.log("✅ TokenFactory deployed to:", tokenFactory.address);

  // Verify deployment
  console.log("\n🔍 Verifying deployment...");
  const standardFee = await tokenFactory.STANDARD_FEE();
  const customFee = await tokenFactory.CUSTOM_FEE();
  const owner = await tokenFactory.owner();

  console.log("📊 Contract Details:");
  console.log("   Standard Fee:", ethers.utils.formatEther(standardFee), "BNB");
  console.log("   Custom Fee:", ethers.utils.formatEther(customFee), "BNB");
  console.log("   Owner:", owner);

  // Test deployment by predicting an address
  console.log("\n🔮 Testing address prediction...");
  try {
    const salt = await tokenFactory.findSaltForSuffix("cafe");
    const predictedAddress = await tokenFactory.predictTokenAddress(salt);
    console.log("   Salt for 'cafe' suffix:", salt);
    console.log("   Predicted address:", predictedAddress);
    console.log("   ✅ Address prediction working correctly!");
  } catch (error) {
    console.log("   ⚠️  Address prediction test failed:", error.message);
  }

  console.log("\n🎉 Deployment completed successfully!");
  console.log("\n📋 Summary:");
  console.log("   Network:", network.name);
  console.log("   TokenFactory Address:", tokenFactory.address);
  console.log("   Deployer:", deployer.address);
  console.log("   Transaction Hash:", tokenFactory.deployTransaction.hash);

  console.log("\n💡 Next steps:");
  console.log("   1. Update your .env file with the factory address:");
  console.log(`      NEXT_PUBLIC_FACTORY_ADDRESS=${tokenFactory.address}`);
  console.log("   2. Verify the contract on BSCScan (if on mainnet/testnet)");
  console.log("   3. Update the frontend hook with the correct factory address");

  // Save deployment info to a file
  const deploymentInfo = {
    network: network.name,
    factoryAddress: tokenFactory.address,
    deployer: deployer.address,
    transactionHash: tokenFactory.deployTransaction.hash,
    standardFee: ethers.utils.formatEther(standardFee),
    customFee: ethers.utils.formatEther(customFee),
    deployedAt: new Date().toISOString(),
  };

  const fs = require('fs');
  fs.writeFileSync(
    'deployment-info.json',
    JSON.stringify(deploymentInfo, null, 2)
  );
  console.log("   4. Deployment info saved to deployment-info.json");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });
