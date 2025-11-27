import pg from 'pg';
const { Client } = pg;

const DATABASE_URL = 'postgresql://neondb_owner:npg_r6QY5HbMReFP@ep-sweet-lab-af2mj6h6-pooler.c-2.us-west-2.aws.neon.tech/neondb?sslmode=require';

async function seedDatabase() {
  const client = new Client({ connectionString: DATABASE_URL });
  
  try {
    console.log('🔄 Connecting to Neon database...');
    await client.connect();
    console.log('✅ Connected successfully!');
    
    // 1. Create demo user
    console.log('\n📝 Creating demo user...');
    const userResult = await client.query(`
      INSERT INTO users (
        "openId", email, username, name, role, 
        bio, "subscriptionTier", "lastSignedIn", "createdAt", "updatedAt"
      ) VALUES (
        'demo-user-001',
        'demo@bithrahapp.com',
        'demo_user',
        'مستخدم تجريبي',
        'user',
        'هذا حساب تجريبي لعرض إمكانيات المنصة',
        'free',
        NOW(),
        NOW(),
        NOW()
      )
      ON CONFLICT ("openId") DO UPDATE SET "updatedAt" = NOW()
      RETURNING id
    `);
    const userId = userResult.rows[0].id;
    console.log(`✅ User created with ID: ${userId}`);
    
    // 2. Create demo idea
    console.log('\n📝 Creating demo idea...');
    const ideaResult = await client.query(`
      INSERT INTO ideas (
        "userId", "ideaName", "ideaDescription", category, sector,
        "evaluationStatus", "isDemo", "createdAt", "updatedAt"
      ) VALUES (
        ${userId},
        'منصة توصيل ذكية',
        'منصة توصيل تستخدم الذكاء الاصطناعي لتحسين مسارات التوصيل وتقليل الوقت',
        'تقنية',
        'تقنية',
        'completed',
        true,
        NOW(),
        NOW()
      )
      ON CONFLICT DO NOTHING
      RETURNING id
    `);
    const ideaId = ideaResult.rows.length > 0 ? ideaResult.rows[0].id : (await client.query('SELECT id FROM ideas WHERE "ideaName" = $1 LIMIT 1', ['منصة توصيل ذكية'])).rows[0].id;
    console.log(`✅ Idea created with ID: ${ideaId}`);
    
    // 3. Create demo project
    console.log('\n📝 Creating demo project...');
    const projectResult = await client.query(`
      INSERT INTO projects (
        "userId", "ideaId", "projectName", slug, description, category,
        "projectStatus", visibility, "fundingGoal", "currentFunding",
        currency, deadline, "isDemo", "createdAt", "updatedAt"
      ) VALUES (
        ${userId},
        ${ideaId},
        'منصة بذره - الوساطة الذكية',
        'bithrah-demo',
        'منصة متكاملة تجمع بين تقييم الأفكار بالذكاء الاصطناعي والدعم الجماعي والتفاوض مع المستثمرين',
        'تقنية',
        'published',
        'public',
        100000,
        25000,
        'SAR',
        NOW() + INTERVAL '30 days',
        true,
        NOW(),
        NOW()
      )
      ON CONFLICT (slug) DO UPDATE SET "updatedAt" = NOW()
      RETURNING id
    `);
    const projectId = projectResult.rows[0].id;
    console.log(`✅ Project created with ID: ${projectId}`);
    
    // 4. Create demo project package
    console.log('\n📝 Creating demo project package...');
    await client.query(`
      INSERT INTO "projectPackages" (
        "projectId", "packageName", "packageDescription", "packageAmount", currency,
        "packageType", "isActive", "createdAt", "updatedAt"
      ) VALUES (
        ${projectId},
        'باقة الداعم المبكر',
        'احصل على وصول مبكر للمنصة + شارة داعم مبكر',
        500,
        'SAR',
        'support',
        true,
        NOW(),
        NOW()
      )
    `);
    console.log(`✅ Project package created`);
    
    // 5. Create demo community post
    console.log('\n📝 Creating demo community post...');
    await client.query(`
      INSERT INTO "communityPosts" (
        "userId", "postType", "postText", "likesCount", "commentsCount",
        "isDemo", "createdAt", "updatedAt"
      ) VALUES (
        ${userId},
        'text',
        'مرحباً بكم في منصة بذره! 🌱 نحن متحمسون لمشاركة رحلتنا معكم في بناء منصة تجمع بين الابتكار والتمويل الجماعي.',
        15,
        3,
        true,
        NOW(),
        NOW()
      )
    `);
    console.log(`✅ Community post created`);
    
    // 6. Create user wallet
    console.log('\n📝 Creating user wallet...');
    await client.query(`
      INSERT INTO "userWallets" (
        "userId", "availableBalance", "pendingBalance", "totalEarned",
        "totalWithdrawn", currency, "createdAt", "updatedAt"
      ) VALUES (
        ${userId},
        0,
        0,
        0,
        0,
        'SAR',
        NOW(),
        NOW()
      )
      ON CONFLICT DO NOTHING
    `);
    console.log(`✅ User wallet created`);
    
    console.log('\n✨ Database seeded successfully!');
    console.log('\n📊 Summary:');
    console.log(`   - 1 demo user`);
    console.log(`   - 1 demo idea`);
    console.log(`   - 1 demo project`);
    console.log(`   - 1 demo project package`);
    console.log(`   - 1 demo community post`);
    console.log(`   - 1 user wallet`);
    
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  } finally {
    await client.end();
  }
}

seedDatabase();
