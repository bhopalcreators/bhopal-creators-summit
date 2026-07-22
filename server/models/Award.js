import mongoose from 'mongoose';

const awardSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: String,
    year: { type: Number, required: true, default: () => new Date().getFullYear() },
    winnerName: String, // filled in after the event
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    deletedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

awardSchema.index({ year: 1, order: 1 });

export default mongoose.model('Award', awardSchema);
