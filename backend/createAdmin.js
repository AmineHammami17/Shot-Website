// This script creates a default admin user if one does not exist.
require('dotenv').config({ path: __dirname + '/.env' });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

const MONGO_URI = process.env.MONGO_URI;

async function createDefaultAdmin() {
  await mongoose.connect(MONGO_URI);

  const adminEmail = 'medaminehammami666@gmail.com';
  const adminPassword = 'admin'; // Change after first login!

  let admin = await User.findOne({ email: adminEmail });
  if (admin) {
    console.log('Admin user already exists:', adminEmail);
    process.exit(0);
  }

  const hashedPassword = await bcrypt.hash(adminPassword, 10);
  admin = new User({
    username: 'admin',
    surname: 'admin',
    email: adminEmail,
    password: hashedPassword,
    role: 'admin',
    isVerified: true
  });
  await admin.save();
  console.log('Default admin user created:', adminEmail);
  process.exit(0);
}

createDefaultAdmin().catch(err => {
  console.error('Error creating admin user:', err);
  process.exit(1);
});
