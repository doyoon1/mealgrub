import bcrypt from 'bcrypt';
import mongoose from 'mongoose';
import { mongooseConnect } from '@/lib/mongoose';
import { UserAccounts } from '@/models/User';

async function validateInputFields({ email, password, firstName, lastName, confirmPassword }) {
  const requiredFields = ['email', 'password', 'firstName', 'lastName', 'confirmPassword'];

  for (const field of requiredFields) {
    if (!eval(field)) {
      return 'All fields are required';
    }
  }

  if (password.length < 5) {
    return 'Password must be at least 5 characters';
  }

  if (password !== confirmPassword) {
    return 'Passwords do not match';
  }

  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&_])[A-Za-z\d@$!%*?&_]+$/;
  if (!passwordRegex.test(password)) {
    return 'Password must be 5 characters with at least one uppercase, one lowercase, one number, and one special character.';
  }

  const nameRegex = /^[a-zA-Z]+$/;
  if (!nameRegex.test(firstName) || !nameRegex.test(lastName)) {
    return 'Name should not contain numbers or special characters';
  }

  return null; // No validation error
}

async function isEmailAlreadyRegistered(email) {
  const existingUser = await UserAccounts.findOne({ email });
  return existingUser !== null;
}

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      await mongooseConnect(); // Connect to MongoDB

      const { email, password, firstName, lastName, confirmPassword } = req.body;

      // Validate input fields
      const validationError = await validateInputFields({
        email,
        password,
        firstName,
        lastName,
        confirmPassword,
      });

      if (validationError) {
        return res.status(400).json({ error: validationError });
      }

      // Check if the email already exists
      if (await isEmailAlreadyRegistered(email)) {
        return res.status(400).json({ error: 'Email is already registered' });
      }

      // Hash the password asynchronously
      const hashedPassword = await bcrypt.hash(password, 10);

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
