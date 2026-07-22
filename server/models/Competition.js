import mongoose from 'mongoose';
import mediaSchema from './shared/mediaSchema.js';

const competitionSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    shortDescription: String,
    body: String, // long-form HTML/markdown for the dedicated page (e.g. CollabVerse)
    coverImage: mediaSchema,
    registerUrl: String,
    ticketProductSlug: String, // links to a Ticket doc for paid competitions
    rules: [String],
    eligibleCategories: [String],
    prizeSummary: String,
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    deletedAt: { type: Date, default: null },
    seo: {
      metaTitle: String,
      metaDescription: String,
      ogImage: String,
    },
  },
  { timestamps: true }
);

competitionSchema.index({ order: 1, isActive: 1 });

export default mongoose.model('Competition', competitionSchema);