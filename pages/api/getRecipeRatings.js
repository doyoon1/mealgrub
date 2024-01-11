import { Rating } from '@/models/Rating';
import { mongooseConnect } from '@/lib/mongoose';

mongooseConnect();

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { recipeId } = req.query;

  try {
    // Fetch and calculate the average and total ratings for the recipe
    const ratings = await Rating.find({ recipe: recipeId });
    const totalRatings = ratings.length;
    const totalRating = ratings.reduce((sum, rating) => sum + rating.value, 0);
    const averageRating = totalRatings > 0 ? totalRating / totalRatings : 0;

    return res.status(200).json({ average: averageRating, total: totalRatings });
  } catch (error) {
    console.error('Error fetching recipe ratings:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}
