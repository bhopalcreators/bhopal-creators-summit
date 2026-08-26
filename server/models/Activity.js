import mongoose from 'mongoose';
import mediaSchema from './shared/mediaSchema.js';

const activitySchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: String,
    coverImage: mediaSchema,
    hostedBy: String, // optional credit line, e.g. "Raghav Singh" for a Shayari session
    // Which edition this activity belongs to (2025, 2026, ...). Pre-2026
    // documents predate this field and have no value — the /2025 page
    // fetches this collection unfiltered, so that's intentional and safe.
    year: { type: Number, default: () => new Date().getFullYear() },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    deletedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

activitySchema.index({ order: 1, isActive: 1 });
activitySchema.index({ year: 1, order: 1 });

export default mongoose.model('Activity', activitySchema);