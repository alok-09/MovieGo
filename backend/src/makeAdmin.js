import mongoose from 'mongoose';
import User from './models/User.js';
import dotenv from 'dotenv';

dotenv.config();

async function makeAdmin() {
  try {
    const email = process.argv[2];

    if (!email) {
      console.error('Usage: node src/makeAdmin.js <email>');
      console.error('Example: node src/makeAdmin.js user@example.com');
      process.exit(1);
    }

    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected\n');

    const user = await User.findOne({ email });

    if (!user) {
      console.error(`User with email "${email}" not found.`);
      await mongoose.disconnect();
      process.exit(1);
    }

    if (user.role === 'admin') {
      console.log(`User "${user.name}" (${email}) is already an admin.`);
    } else {
      user.role = 'admin';
      await user.save();
      console.log(`Successfully granted admin privileges to "${user.name}" (${email}).`);
    }

    await mongoose.disconnect();
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

makeAdmin();
