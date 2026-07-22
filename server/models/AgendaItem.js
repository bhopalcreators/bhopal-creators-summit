import mongoose from 'mongoose';

const agendaItemSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    timeLabel: { type: String, required: true }, // "11:00 AM – 2:00 PM"
    description: String,
    subItems: [String],
    year: { type: Number, default: () => new Date().getFullYear() },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    deletedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

agendaItemSchema.index({ year: 1, order: 1 });

export default mongoose.model('AgendaItem', agendaItemSchema);
