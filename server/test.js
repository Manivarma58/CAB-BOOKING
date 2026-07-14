// Backend Unit and Integration Testing Script
require('dotenv').config();
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

const runTests = async () => {
  console.log('--- UCab Backend Tests ---');
  let failures = 0;

  // Test 1: Env configuration validation
  try {
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET env variable is not loaded!');
    }
    console.log('✓ Test 1 Passed: JWT_SECRET check successful.');
  } catch (err) {
    console.error('✗ Test 1 Failed:', err.message);
    failures++;
  }

  // Test 2: Token verification logic
  try {
    const payload = { id: 'mock_user_123', role: 'user' };
    const secret = process.env.JWT_SECRET || 'test_secret';
    const token = jwt.sign(payload, secret, { expiresIn: '1h' });
    const decoded = jwt.verify(token, secret);
    
    if (decoded.id !== payload.id || decoded.role !== payload.role) {
      throw new Error('Decoded token data mismatch');
    }
    console.log('✓ Test 2 Passed: JWT Token Sign & Verify successful.');
  } catch (err) {
    console.error('✗ Test 2 Failed:', err.message);
    failures++;
  }

  // Test 3: Bcrypt hashing verification
  try {
    const rawPassword = 'SecurePassword123';
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(rawPassword, salt);
    
    const isMatch = await bcrypt.compare(rawPassword, hash);
    const isBadMatch = await bcrypt.compare('WrongPassword', hash);
    
    if (!isMatch || isBadMatch) {
      throw new Error('Bcrypt password comparison logic failed');
    }
    console.log('✓ Test 3 Passed: Password Bcrypt hashing & comparison check successful.');
  } catch (err) {
    console.error('✗ Test 3 Failed:', err.message);
    failures++;
  }

  // Test 4: Schema validation compile
  try {
    if (User.modelName !== 'User') {
      throw new Error('User schema compile failed');
    }
    console.log('✓ Test 4 Passed: Mongoose Models loaded and compiled.');
  } catch (err) {
    console.error('✗ Test 4 Failed:', err.message);
    failures++;
  }

  console.log('\n--- Test Summary ---');
  if (failures === 0) {
    console.log('All backend checks completed successfully (4/4)!');
    process.exit(0);
  } else {
    console.log(`${failures} test(s) failed.`);
    process.exit(1);
  }
};

runTests();
