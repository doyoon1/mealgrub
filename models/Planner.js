import mongoose, { model, Schema, models } from 'mongoose';

const PlannerSchema = new Schema(
  {
    user: { type: mongoose.Types.ObjectId, ref: 'UserAccounts', required: true },
    planner: [
      {
        day: { type: String, required: true },
        meals: {
          Breakfast: [{ type: mongoose.Types.ObjectId, ref: 'Recipe' }],
          Lunch: [{ type: mongoose.Types.ObjectId, ref: 'Recipe' }],
          Dinner: [{ type: mongoose.Types.ObjectId, ref: 'Recipe' }],
          Other: [{ type: mongoose.Types.ObjectId, ref: 'Recipe' }],
        },
      },
    ],
  },
  { timestamps: true }
);

export const Planner = models?.Planner || model('Planner', PlannerSchema);