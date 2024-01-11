import { mongooseConnect } from '@/lib/mongoose';
import { Recipe } from '@/models/Recipe';

export default async function handler(req, res) {
  await mongooseConnect();

  if (req.method === 'GET') {
    try {
      const recipes = await Recipe.find({}, { ingredients: 1 });
      const uniqueIngredientsSet = new Set();

      recipes.forEach((recipe) => {
        recipe.ingredients.forEach((ingredient) => {
          uniqueIngredientsSet.add(ingredient.name);
        });
      });

      const uniqueIngredients = Array.from(uniqueIngredientsSet);

      res.status(200).json({ ingredients: uniqueIngredients });
    } catch (error) {
      console.error('Error fetching ingredients:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}
