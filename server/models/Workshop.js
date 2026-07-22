import mongoose from 'mongoose';
import mediaSchema from './shared/mediaSchema.js';

const workshopSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    facilitatorName: String,
    description: String,
    coverImage: mediaSchema,
    timeSlot: String,
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    deletedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

workshopSchema.index({ order: 1, isActive: 1 });

export default mongoose.model('Workshop', workshopSchema);
