import mongoose, { model, Schema, models } from 'mongoose';

const visitCountSchema = new Schema(
  {
    count: { type: Number, default: 0, },
  }
);

export const VisitCount = models?.VisitCount || model('VisitCount', visitCountSchema);