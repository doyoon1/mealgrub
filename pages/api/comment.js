import { Comment } from '@/models/Comment';
import { mongooseConnect } from '@/lib/mongoose';

mongooseConnect();

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const { recipeId } = req.query;
      console.log('Recipe ID:', recipeId);

      const comments = await Comment.find({ recipe: recipeId }).populate('user');
      console.log('Fetched Comments:', comments);

      return res.status(200).json({ comments });
    } catch (error) {
      console.error('Error fetching comments:', error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  } else if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const { recipeId, userId, text } = req.body;

    const newComment = new Comment({
      recipe: recipeId,
      user: userId,
      text,
    });

    await newComment.save();

    return res.status(201).json({ message: 'Comment added successfully', comment: newComment });
  } catch (error) {
    console.error('Error adding comment:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}
