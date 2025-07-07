const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./models/userModel');

const createTestUser = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/bugslayers');

    const email = 'admin@example.com';
    const plainPassword = 'password123';

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log('User already exists');
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    const newUser = new User({
      email,
      password: hashedPassword,
    });

    await newUser.save();
    console.log('Test user created');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

createTestUser();
