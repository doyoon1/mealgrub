import mongoose, { model, Schema, models } from "mongoose";

const commentSchema = new mongoose.Schema({
  user: { type: mongoose.Types.ObjectId, ref: 'UserAccounts', required: true },
  recipe: { type: mongoose.Types.ObjectId, ref: 'Recipe', required: true },
  text: { type: String, required: true },
  approved: { type: Boolean, default: false },
}, {
  timestamps: true,
});

export const Comment = models.Comment || model('Comment', commentSchema);

