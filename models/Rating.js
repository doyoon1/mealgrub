import mongoose, { model, Schema, models } from "mongoose";

const ratingSchema = new Schema({
  recipe: { type: mongoose.Types.ObjectId, ref: 'Recipe', required: true },
  user: { type: mongoose.Types.ObjectId, ref: 'UserAccounts', required: true },
  value: { type: Number, required: true },
}, {
  timestamps: true,
});

export const Rating = models.Rating || model('Rating', ratingSchema);