import { getSession } from 'next-auth/react';
import { mongooseConnect } from '@/lib/mongoose';
import { UserAccounts } from '@/models/User';
import toast from 'react-hot-toast';
import mongoose from 'mongoose';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      await mongooseConnect();

      const session = await getSession({ req });

      const { firstName, lastName } = req.body;

      // Validate input fields
      if (!firstName || !lastName) {
        toast.error('First name and last name are required');
        return res.status(400).json({ error: 'First name and last name are required' });
      }

      // Update user profile in the database
      const updatedUser = await UserAccounts.findOneAndUpdate(
        { email: session?.user?.email },
        { $set: { firstName, lastName } },
        { new: true } // Return the updated document
      );

      // Close the MongoDB connection
      await mongoose.connection.close();

      // Display success message
      toast.success('Profile updated successfully');

      // Send response
      res.status(200).json(updatedUser);
    } catch (error) {
      // Handle errors
      console.error('Error updating profile:', error);
      toast.error('Internal Server Error');
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}