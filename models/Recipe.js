import mongoose, { model, Schema, models } from "mongoose";

const recipeSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  images: [{ type: String }],
  category: [{ type: mongoose.Types.ObjectId, ref: 'Category' }],
  cookingTime: { type: String },
  citation: { type: String },
  citationLink: { type: String },
  servings: { type: Number, default: 1 },
  ingredients: [{ type: Object, required: true }],
  procedure: [{ type: String }],
  videoLink: { type: String },
  nutriValue: [{ type: Object, required: true }],
  featured: { type: Boolean, default: false },
  averageRating: { type: Number, default: 0 },
  hidden: { type: Boolean, default: false },
}, {
  timestamps: true,
});

export const Recipe = models.Recipe || model('Recipe', recipeSchema);