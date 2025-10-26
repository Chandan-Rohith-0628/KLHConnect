// Test script to register a user and verify MongoDB
const testUser = {
  name: "Test User",
  email: "test@klh.edu.in",
  password: "Test@123",
  studentId: "2021001",
  role: "student",
  department: "CSE",
  year: 3,
  phone: "9876543210"
};

async function registerUser() {
  try {
    console.log('🧪 Testing user registration...\n');
    console.log('📤 Sending registration request...');
    
    const response = await fetch('http://localhost:5000/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testUser)
    });

    const data = await response.json();
    
    if (response.ok) {
      console.log('✅ User registered successfully!\n');
      console.log('📊 Response:', JSON.stringify(data, null, 2));
      console.log('\n🎉 Now check MongoDB Compass:');
      console.log('   1. Refresh the database view');
      console.log('   2. Click on "klhconnect" database');
      console.log('   3. Click on "users" collection');
      console.log('   4. You should see the test user!\n');
    } else {
      console.log('⚠️ Registration response:', JSON.stringify(data, null, 2));
      if (data.message && data.message.includes('already exists')) {
        console.log('\n✅ User already exists! Check Compass - data is there.');
      }
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.log('\n💡 Make sure backend server is running: npm run dev');
  }
}

registerUser();
