import mongoose from 'mongoose';
import { User } from '../models/User';
import dotenv from 'dotenv';

dotenv.config();

const createAdminUser = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || '');

    const adminEmail = process.env.ADMIN_EMAIL || 'admin@maidmatch.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123!@#';

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: adminEmail });
    if (existingAdmin) {
      console.log('Admin user already exists');
      process.exit(0);
    }

    // Create admin user
    const admin = new User({
      email: adminEmail,
      password: adminPassword,
      fullName: 'System Administrator',
      role: 'admin',
      verificationStatus: 'verified'
    });

    await admin.save();
    console.log('Admin user created successfully');
    console.log('Email:', adminEmail);
    console.log('Password:', adminPassword);
  } catch (error) {
    console.error('Error creating admin user:', error);
  } finally {
    await mongoose.disconnect();
  }
};

createAdminUser();
