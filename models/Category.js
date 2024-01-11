import mongoose, { model, Schema, models } from "mongoose";

const CategorySchema = new Schema({
  name: { type: String, required: true },
  parent: { type: String, },
});

const Category = models.Category || model('Category', CategorySchema);

export default Category;
