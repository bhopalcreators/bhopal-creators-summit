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
    // Which edition this competition belongs to (2025, 2026, ...). Existing
    // pre-2026 documents predate this field and simply have no value, which
    // is why the public site's /2025 page fetches this collection with no
    // year filter at all — it keeps showing every competition it always has.
    year: { type: Number, default: () => new Date().getFullYear() },
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
competitionSchema.index({ year: 1, order: 1 });

export default mongoose.model('Competition', competitionSchema);