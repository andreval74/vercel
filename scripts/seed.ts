
import { PrismaClient } from '@prisma/client';
import * as ethers from 'ethers';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  try {
    // Create admin user
    const adminWallet = '0x742d35Cc6634C0532925a3b8D53fD3B4c5B89E4B';
    
    const adminUser = await prisma.user.upsert({
      where: { walletAddress: adminWallet.toLowerCase() },
      update: {},
      create: {
        walletAddress: adminWallet.toLowerCase(),
        name: 'Admin User',
        email: 'admin@sccafe.com'
      }
    });

    console.log('✅ Admin user created:', adminUser.id);

    // Create admin privileges
    await prisma.adminUser.upsert({
      where: { walletAddress: adminWallet.toLowerCase() },
      update: {},
      create: {
        walletAddress: adminWallet.toLowerCase(),
        role: 'super_admin',
        permissions: ['manage_tokens', 'manage_users', 'manage_config', 'view_analytics']
      }
    });

    console.log('✅ Admin privileges granted');

    // Create test users
    const testUsers = [
      {
        walletAddress: '0x1234567890123456789012345678901234567890',
        name: 'Test User 1',
        email: 'user1@test.com'
      },
      {
        walletAddress: '0xabcdef1234567890abcdef1234567890abcdef12',
        name: 'Test User 2',
        email: 'user2@test.com'
      }
    ];

    for (const userData of testUsers) {
      const user = await prisma.user.upsert({
        where: { walletAddress: userData.walletAddress.toLowerCase() },
        update: {},
        create: {
          walletAddress: userData.walletAddress.toLowerCase(),
          name: userData.name,
          email: userData.email
        }
      });

      console.log('✅ Test user created:', user.name);
    }

    // Create sample tokens
    const sampleTokens = [
      {
        name: 'Sample Token A',
        symbol: 'STA',
        decimals: 18,
        totalSupply: '1000000',
        salt: ethers.keccak256(ethers.toUtf8Bytes('sample_a_1')),
        saltHash: ethers.keccak256(ethers.toUtf8Bytes('sample_a_1')),
        predictedAddress: '0x1234567890cafe1234567890cafe1234567890ca',
        ownerAddress: testUsers[0].walletAddress.toLowerCase(),
        creatorId: '', // Will be filled
        deployed: true,
        deploymentTxHash: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
        deploymentDate: new Date('2025-01-01')
      },
      {
        name: 'Custom Address Token',
        symbol: 'CAT',
        decimals: 18,
        totalSupply: '500000',
        salt: ethers.keccak256(ethers.toUtf8Bytes('custom_cat_1')),
        saltHash: ethers.keccak256(ethers.toUtf8Bytes('custom_cat_1')),
        predictedAddress: '0xdeadbeef12345678901234567890deadbeef1234',
        ownerAddress: testUsers[1].walletAddress.toLowerCase(),
        creatorId: '', // Will be filled
        deployed: false
      }
    ];

    // Get user IDs for token creation
    const user1 = await prisma.user.findUnique({
      where: { walletAddress: testUsers[0].walletAddress.toLowerCase() }
    });
    const user2 = await prisma.user.findUnique({
      where: { walletAddress: testUsers[1].walletAddress.toLowerCase() }
    });

    if (user1 && user2) {
      sampleTokens[0].creatorId = user1.id;
      sampleTokens[1].creatorId = user2.id;

      for (const tokenData of sampleTokens) {
        await prisma.token.upsert({
          where: { salt: tokenData.salt },
          update: {},
          create: tokenData
        });

        console.log('✅ Sample token created:', tokenData.name);
      }
    }

    // Create system configuration
    const systemConfigs = [
      { key: 'deploymentFee', value: '0.01', description: 'Fee in BNB for token deployment' },
      { key: 'maxSearchAttempts', value: '10000', description: 'Maximum attempts for salt pattern search' },
      { key: 'platformEnabled', value: 'true', description: 'Platform availability status' }
    ];

    for (const config of systemConfigs) {
      await prisma.systemConfig.upsert({
        where: { key: config.key },
        update: { value: config.value },
        create: config
      });

      console.log('✅ System config set:', config.key);
    }

    console.log('🎉 Database seeding completed successfully!');
    
    // Print summary
    const stats = {
      users: await prisma.user.count(),
      adminUsers: await prisma.adminUser.count(),
      tokens: await prisma.token.count(),
      systemConfigs: await prisma.systemConfig.count()
    };

    console.log('\n📊 Database Summary:');
    console.log(`   Users: ${stats.users}`);
    console.log(`   Admin Users: ${stats.adminUsers}`);
    console.log(`   Tokens: ${stats.tokens}`);
    console.log(`   System Configs: ${stats.systemConfigs}`);

  } catch (error) {
    console.error('❌ Error during seeding:', error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
