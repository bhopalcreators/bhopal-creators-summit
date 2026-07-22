import mongoose from 'mongoose';
import mediaSchema from './shared/mediaSchema.js';

const activitySchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: String,
    coverImage: mediaSchema,
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    deletedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

activitySchema.index({ order: 1, isActive: 1 });

export default mongoose.model('Activity', activitySchema);
