import mongoose, { model, Schema, models } from "mongoose";

const CategorySchema = new Schema({
  name: { type: String, required: true },
  parent: { type: String, },
});

export const Category = models.Category || model('Category', CategorySchema);