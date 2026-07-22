import mongoose from 'mongoose';
import mediaSchema from './shared/mediaSchema.js';

const sponsorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    logo: mediaSchema,
    websiteUrl: String,
    tier: {
      type: String,
      enum: ['title', 'platinum', 'gold', 'silver', 'partner', 'media_partner'],
      default: 'partner',
    },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    deletedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

sponsorSchema.index({ tier: 1, order: 1 });

export default mongoose.model('Sponsor', sponsorSchema);
