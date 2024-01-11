import { Recipe } from "@/models/Recipe";
import { mongooseConnect } from "@/lib/mongoose";

export default async (req, res) => {
  const { query } = req.query;

  await mongooseConnect();

  try {
    const recipes = await Recipe.find({ title: { $regex: query, $options: 'i' } });
    
    res.status(200).json({ recipes });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while searching for recipes.' });
  }
};