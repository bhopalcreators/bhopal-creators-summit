import mongoose from 'mongoose';
import mediaSchema from './shared/mediaSchema.js';

const galleryAlbumSchema = new mongoose.Schema(
  {
    title: { type: String, required: true }, // "2024 Highlights"
    year: { type: Number, required: true },
    coverImage: mediaSchema,
    description: String,
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    deletedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

galleryAlbumSchema.index({ year: 1, order: 1 });

export default mongoose.model('GalleryAlbum', galleryAlbumSchema);
