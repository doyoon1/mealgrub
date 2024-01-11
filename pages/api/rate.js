import { connectToDatabase, ObjectId } from '@/lib/mongodb';
import { Rating } from '@/models/Rating';

export default async function handler(req, res) {
  const { method, query, body } = req;

  switch (method) {
    case 'GET':
      await handleGet(query, res);
      break;
    case 'POST':
      await handlePost(body, res);
      break;
    default:
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}

async function handleGet(query, res) {
  try {
    console.log('Recipe ID:', query.recipeId);

    const { db } = await connectToDatabase();

    const ratings = await db
      .collection('ratings')
      .find({ recipe: new ObjectId(query.recipeId) })
      .toArray();

    res.status(200).json({ ratings });
  } catch (error) {
    console.error('Error fetching ratings:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

async function handlePost({ recipeId, value }, res) {
  try {
    if (!recipeId || !value) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const { db } = await connectToDatabase();

    const newRating = {
      recipe: new ObjectId(recipeId),
      value: parseInt(value),
    };

    try {
      const result = await db.collection('ratings').insertOne(newRating);

      // Respond with the inserted rating on success
      res.status(201).json({ success: true, rating: newRating });
    } catch (error) {
      // If an error occurs during insertion, handle it
      console.error('Error inserting rating into ratings collection:', error);
      res.status(500).json({ error: 'Failed to insert rating' });
    }
  } catch (error) {
    console.error('Error creating rating:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}