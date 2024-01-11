import { getSession } from 'next-auth/react';
import { UserAccounts } from '@/models/User';

export default async (req, res) => {
  const session = await getSession({ req });

  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    // Fetch the user data including the planner from the database
    const user = await UserAccounts.findById(session.user._id);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Return the planner data
    return res.status(200).json(user.planner || []);
  } catch (error) {
    console.error('Error fetching planner data:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};
