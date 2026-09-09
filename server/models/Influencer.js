import mongoose from 'mongoose';
import mediaSchema from './shared/mediaSchema.js';

// "Our Core & Key Influencers" — the spotlighted creator profiles shown in
// the Key Influencers carousel on the homepage (name, handle, follower
// count, role and bio), each with an uploadable profile picture.
const influencerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    role: { type: String, default: '' }, // e.g. "Founder, Bhopal Creator Community"
    handle: { type: String, default: '' }, // e.g. "@shivanshchoubeyy"
    followers: { type: String, default: '' }, // e.g. "239K Followers" — free text so "1L+" etc. also works
    bio: { type: String, default: '' },
    photo: mediaSchema,
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    deletedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

influencerSchema.index({ order: 1 });

export default mongoose.model('Influencer', influencerSchema);