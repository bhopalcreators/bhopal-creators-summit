import mongoose from 'mongoose';
import mediaSchema from './shared/mediaSchema.js';

const speakerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    title: String, // e.g. "Content Creator, 2M followers"
    bio: String,
    photo: mediaSchema,
    category: {
      type: String,
      enum: ['speaker', 'committee', 'judge', 'host', 'volunteer'],
      default: 'speaker',
    },
    socialLinks: [{ platform: String, url: String, _id: false }],
    year: { type: Number, default: () => new Date().getFullYear() },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    deletedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

speakerSchema.index({ year: 1, category: 1, order: 1 });

export default mongoose.model('Speaker', speakerSchema);
