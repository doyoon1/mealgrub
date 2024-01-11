import { mongooseConnect } from '@/lib/mongoose';
import { Recipe } from '@/models/Recipe';

mongooseConnect();

export default async function handler(req, res) {
  if (req.method === 'GET') {
    if (req.query.id) {
      // Fetch a single recipe by ID
      try {
        const recipe = await Recipe.findById(req.query.id);
        if (!recipe) {
          return res.status(404).json({ message: 'Recipe not found' });
        }
        return res.status(200).json(recipe);
      } catch (error) {
        console.error('Error fetching recipe by ID:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
      }
    } else {
      // Fetch all recipes
      try {
        const recipes = await Recipe.find();
        return res.status(200).json(recipes);
      } catch (error) {
        console.error('Error fetching recipes:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
      }
    }
  } else {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }
}