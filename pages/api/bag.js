import { mongooseConnect } from '@/lib/mongoose';
import { UserAccounts } from '@/models/User';

mongooseConnect();

export default async function handler(req, res) {
  if (req.method === 'GET') {
    // Get user's bag
    return getUserBag(req, res);
  } else if (req.method === 'POST') {
    // Update, add, or remove recipe
    return manageUserBag(req, res);
  } else {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }
}

async function getUserBag(req, res) {
  const { userId } = req.query;

  try {
    const user = await UserAccounts.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json({ bag: user.bag });
  } catch (error) {
    console.error('Error fetching user bag:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}

async function manageUserBag(req, res) {
  const { userId, recipeId, action } = req.body;

  try {
    const user = await UserAccounts.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (action === 'add' && !user.bag.includes(recipeId)) {
      user.bag.push(recipeId);
    } else if (action === 'remove') {
      user.bag = user.bag.filter((id) => id.toString() !== recipeId);
    }

    await user.save();

    return res.status(200).json({
      message: action === 'add' ? 'Recipe added to the bag successfully' : 'Recipe removed from the bag successfully',
    });
  } catch (error) {
    console.error('Error managing user bag:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}