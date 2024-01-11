import mongoose, { model, Schema, models } from 'mongoose';
import { Recipe } from './Recipe';

const UserSchema = new Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    bag: [{ type: mongoose.Types.ObjectId, ref: 'Recipe' }],
  },
  { timestamps: true }
);

export const UserAccounts = models?.UserAccounts || model('UserAccounts', UserSchema);
