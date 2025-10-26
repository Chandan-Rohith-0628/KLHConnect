// Quick script to check what's in MongoDB
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

async function checkDatabase() {
  try {
    console.log('🔍 Checking MongoDB database...\n');
    
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');
    
    // Get database
    const db = mongoose.connection.db;
    
    // List all collections
    const collections = await db.listCollections().toArray();
    console.log(`📊 Collections found: ${collections.length}`);
    collections.forEach(col => console.log(`   - ${col.name}`));
    console.log('');
    
    // Check users collection
    if (collections.some(col => col.name === 'users')) {
      const usersCount = await db.collection('users').countDocuments();
      console.log(`👥 Users collection: ${usersCount} documents`);
      
      if (usersCount > 0) {
        console.log('\n📄 Sample user data:');
        const users = await db.collection('users').find({}).limit(2).toArray();
        users.forEach(user => {
          console.log(`   - ${user.name} (${user.email}) - Role: ${user.role}`);
        });
      } else {
        console.log('   ⚠️ Users collection is EMPTY - no registrations saved!');
      }
    } else {
      console.log('❌ Users collection does NOT exist yet');
    }
    
    console.log('\n✅ Database check complete');
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

checkDatabase();
