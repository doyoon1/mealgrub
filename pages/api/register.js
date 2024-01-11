import bcrypt from 'bcrypt';
import mongoose from 'mongoose';
import { mongooseConnect } from '@/lib/mongoose';
import { UserAccounts } from '@/models/User';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      await mongooseConnect(); // Connect to MongoDB

      const { email, password, firstName, lastName, confirmPassword } = req.body;

      // Validate input fields
      if (!email || !password || !firstName || !lastName || !confirmPassword) {
        return res.status(400).json({ error: 'All fields are required' });
      }

      if (password.length < 5) {
        return res.status(400).json({ error: 'Password must be at least 5 characters' });
      }

      if (password !== confirmPassword) {
        return res.status(400).json({ error: 'Passwords do not match' });
      }

      if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/.test(password)) {
        return res.status(400).json({
          error:
            'Password must be 5 characters with at least one uppercase, one lowercase, one number, and one special character.',
        });
      }

      if (!/^[a-zA-Z]+$/.test(firstName) || !/^[a-zA-Z]+$/.test(lastName)) {
        return res.status(400).json({ error: 'Name should not contain numbers or special characters' });
      }

      // Check if the email already exists
      const existingUser = await UserAccounts.findOne({ email });

      if (existingUser) {
        // Email is already registered
        return res.status(400).json({ error: 'Email is already registered' });
      }

      // Hash the password
      const salt = bcrypt.genSaltSync(10);
      const hashedPassword = bcrypt.hashSync(password, salt);

      // Create user
      const createdUser = await UserAccounts.create({
        email,
        password: hashedPassword,
        firstName,
        lastName,
      });

      // Close the MongoDB connection
      await mongoose.connection.close();

      // Send response
      res.status(200).json({ message: 'User created successfully' });
    } catch (error) {
      // Handle errors
      console.error('Error in registration process:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
