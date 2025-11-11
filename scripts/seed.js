require('dotenv').config();
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const connectDB = require('../utils/db');
const User = require('../models/User');
const ApiKey = require('../models/ApiKey');

// user 

async function seedDatabase() {
  await connectDB();

  console.log(' Starting MongoDB seed...');
  const password = 'testpassword123';
  const hashedPassword = await bcrypt.hash(password, 10);

  let user = await User.findOne({ email: 'test@example.com' });

  if (!user) {
    user = await User.create({ email: 'test@example.com', password_hash: hashedPassword });
    console.log('Created test user:', user.email);
  } else {
    console.log('Test user already exists');
  }

  const existingKey = await ApiKey.findOne({ user_id: user._id, name: 'Test API Key' });

  if (!existingKey) {
    const apiKey = 'test-api-key-' + crypto.randomBytes(16).toString('hex');
    await ApiKey.create({
      user_id: user._id,
      key_value: apiKey,
      name: 'Test API Key',
      is_active: true,
    });
    console.log('Created API key:', apiKey);
  } else {
    console.log('API key already exists:', existingKey.key_value);
  }

  console.log('\n=== Seed Summary ===');
  console.log('Email: test@example.com');
  console.log('Password:', password);
  console.log('====================');
  process.exit(0);
}

seedDatabase();
