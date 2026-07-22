import mongoose from 'mongoose';

const ticketSchema = new mongoose.Schema(
  {
    label: { type: String, required: true }, // "FIRST 100", "Early Bird", "Standard"
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    description: String,
    eventDate: Date,
    price: { type: Number, required: true, min: 0 },
    originalPrice: { type: Number, min: 0 },
    currency: { type: String, default: 'INR' },
    totalStock: { type: Number, default: null }, // null = unlimited
    soldCount: { type: Number, default: 0 },
    salesStartAt: Date,
    salesEndAt: Date,
    status: {
      type: String,
      enum: ['upcoming', 'available', 'sold-out', 'closed'],
      default: 'upcoming',
    },
    order: { type: Number, default: 0 },
    deletedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

ticketSchema.virtual('remainingStock').get(function remainingStock() {
  if (this.totalStock == null) return null;
  return Math.max(this.totalStock - this.soldCount, 0);
});

ticketSchema.set('toJSON', { virtuals: true });
ticketSchema.index({ status: 1, order: 1 });

export default mongoose.model('Ticket', ticketSchema);