import mongoose from 'mongoose';
import mediaSchema from './shared/mediaSchema.js';

const workshopSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    facilitatorName: String,
    description: String,
    coverImage: mediaSchema,
    timeSlot: String,
    // Which edition this workshop belongs to (2025, 2026, ...). Pre-2026
    // documents predate this field and have no value — the /2025 page
    // fetches this collection unfiltered, so that's intentional and safe.
    year: { type: Number, default: () => new Date().getFullYear() },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    deletedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

workshopSchema.index({ order: 1, isActive: 1 });
workshopSchema.index({ year: 1, order: 1 });

export default mongoose.model('Workshop', workshopSchema);