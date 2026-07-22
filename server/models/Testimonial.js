import mongoose from 'mongoose';
import mediaSchema from './shared/mediaSchema.js';

const testimonialSchema = new mongoose.Schema(
  {
    handle: { type: String, required: true },
    displayName: String,
    quote: { type: String, required: true },
    avatarOrClip: mediaSchema,
    year: { type: Number, default: () => new Date().getFullYear() },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    deletedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

testimonialSchema.index({ year: 1, order: 1 });

export default mongoose.model('Testimonial', testimonialSchema);
