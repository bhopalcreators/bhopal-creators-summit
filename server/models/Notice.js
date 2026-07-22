import mongoose from 'mongoose';
import mediaSchema from './shared/mediaSchema.js';

const noticeSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    body: String,
    type: { type: String, enum: ['notice', 'marquee', 'news'], default: 'notice' },
    isActive: { type: Boolean, default: true },
    expiresAt: Date,
    order: { type: Number, default: 0 },
    deletedAt: { type: Date, default: null },
  },
  { timestamps: true }
);
noticeSchema.index({ type: 1, isActive: 1, order: 1 });

const blogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    excerpt: String,
    body: String,
    coverImage: mediaSchema,
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    status: { type: String, enum: ['draft', 'published'], default: 'draft' },
    publishedAt: Date,
    seo: { metaTitle: String, metaDescription: String, ogImage: String },
    deletedAt: { type: Date, default: null },
  },
  { timestamps: true }
);
blogSchema.index({ status: 1, publishedAt: -1 });

export const Notice = mongoose.model('Notice', noticeSchema);
export const Blog = mongoose.model('Blog', blogSchema);