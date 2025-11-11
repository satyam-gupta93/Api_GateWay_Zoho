require('dotenv').config();
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const connectDB = require('../utils/db');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// genrate token

async function generateToken() {
  try {
    await connectDB();

    const user = await User.findOne({ email: 'test@example.com' }).select('_id email');
    if (!user) {
      console.error('Test user not found. Run: node scripts/seed.js first');
      process.exit(1);
    }

    const token = jwt.sign(
      {
        userId: user._id.toString(),
        email: user.email,
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    console.log('\n=== JWT Token Generated ===');
    console.log('User:', user.email);
    console.log('Token:', token);
    console.log('Valid for: 24 hours');
    console.log('==============================\n');

    mongoose.connection.close();
  } catch (error) {
    console.error('Error generating token:', error.message);
    process.exit(1);
  }
}

generateToken();
