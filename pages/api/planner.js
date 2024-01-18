import { mongooseConnect } from '@/lib/mongoose';
import { UserAccounts } from '@/models/User';
import { Planner } from '@/models/Planner';

mongooseConnect();

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { userId } = req.query;

    try {
      const userPlanner = await Planner.findOne({ user: userId });
      return res.status(200).json(userPlanner);
    } catch (error) {
      console.error('Error fetching user planner:', error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  } else if (req.method === 'POST') {
    return addToPlanner(req, res);
  } else {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }
}

async function addToPlanner(req, res) {
  const { userId, day, meals, recipeId } = req.body;

  try {
    let planner = await Planner.findOne({ user: userId });

    if (!planner) {
      planner = new Planner({ user: userId, planner: [] });
    }

    const mealsArray = Array.isArray(meals) ? meals : [meals];

    const existingEntryIndex = planner.planner.findIndex((entry) => entry.day === day);

    if (existingEntryIndex !== -1) {
      mealsArray.forEach((meal) => {
        if (!planner.planner[existingEntryIndex].meals[meal]) {
          planner.planner[existingEntryIndex].meals[meal] = [];
        }

        if (!planner.planner[existingEntryIndex].meals[meal].includes(recipeId)) {
          planner.planner[existingEntryIndex].meals[meal].push(recipeId);
        }
      });
    } else {
      const newEntry = {
        day,
        meals: {},
      };

      mealsArray.forEach((meal) => {
        newEntry.meals[meal] = [recipeId];
      });

      planner.planner.push(newEntry);
    }

    await planner.save();

    return res.status(200).json({
      message: 'Recipe added to the planner successfully',
      planner: planner.planner,
    });
  } catch (error) {
    console.error('Error adding recipe to planner:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}