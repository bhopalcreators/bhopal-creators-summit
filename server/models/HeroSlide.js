import mongoose from 'mongoose';
import mediaSchema from './shared/mediaSchema.js';

const ctaButtonSchema = new mongoose.Schema(
  {
    label: { type: String, required: true },
    href: { type: String, required: true },
    variant: { type: String, enum: ['flare', 'light', 'outline', 'ghost'], default: 'flare' },
  },
  { _id: false }
);

const heroSlideSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    dateLabel: String,
    venueLabel: String,
    backgroundMedia: mediaSchema,
    ctaButtons: [ctaButtonSchema],
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    deletedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

heroSlideSchema.index({ order: 1, isActive: 1 });

export default mongoose.model('HeroSlide', heroSlideSchema);
