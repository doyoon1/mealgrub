import { mongooseConnect } from '@/lib/mongoose';
import { UserAccounts } from '@/models/User';
import { Planner } from '@/models/Planner';

mongooseConnect();

export default async function handler(req, res) {
  if (req.method === 'GET') {
    // Get user's planner
    const { userId } = req.query;

    try {
      const userPlanner = await Planner.findOne({ user: userId });
      return res.status(200).json(userPlanner);
    } catch (error) {
      console.error('Error fetching user planner:', error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  } else if (req.method === 'POST') {
    // Add recipe to the planner
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

    // Convert meals to an array if it's a string
    const mealsArray = Array.isArray(meals) ? meals : [meals];

    // Check if the specified day already exists in the planner
    const existingEntryIndex = planner.planner.findIndex((entry) => entry.day === day);

    if (existingEntryIndex !== -1) {
      // If the day exists, add the recipe to the specified meal categories
      mealsArray.forEach((meal) => {
        // Check if the meal category already exists
        if (!planner.planner[existingEntryIndex].meals[meal]) {
          planner.planner[existingEntryIndex].meals[meal] = [];
        }

        // Check if the recipe is not already added
        if (!planner.planner[existingEntryIndex].meals[meal].includes(recipeId)) {
          planner.planner[existingEntryIndex].meals[meal].push(recipeId);
        }
      });
    } else {
      // If the day doesn't exist, create a new entry
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