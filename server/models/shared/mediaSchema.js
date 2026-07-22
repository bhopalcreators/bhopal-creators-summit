import mongoose from 'mongoose';

const mediaSchema = new mongoose.Schema(
  {
    url: { type: String, required: true },
    publicId: { type: String, required: true }, // Cloudinary public_id, needed to delete/replace
    type: { type: String, enum: ['image', 'video', 'document'], default: 'image' },
    altText: { type: String, default: '' },
    width: Number,
    height: Number,
  },
  { _id: false }
);

export default mediaSchema;
