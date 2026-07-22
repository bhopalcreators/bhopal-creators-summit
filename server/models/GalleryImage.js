import mongoose from 'mongoose';
import mediaSchema from './shared/mediaSchema.js';

const galleryImageSchema = new mongoose.Schema(
  {
    album: { type: mongoose.Schema.Types.ObjectId, ref: 'GalleryAlbum', required: true },
    media: { type: mediaSchema, required: true },
    caption: String,
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    deletedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

galleryImageSchema.index({ album: 1, order: 1 });

export default mongoose.model('GalleryImage', galleryImageSchema);
