import mongoose from 'mongoose';

const submissionSchema = new mongoose.Schema(
  {
    formType: {
      type: String,
      enum: ['contact', 'registration', 'sponsor_inquiry', 'competition_entry', 'newsletter'],
      required: true,
    },
    ticketReference: String, // for competition entries requiring a purchased ticket number
    fields: { type: mongoose.Schema.Types.Mixed, required: true }, // arbitrary form fields
    status: {
      type: String,
      enum: ['new', 'reviewed', 'approved', 'rejected', 'spam'],
      default: 'new',
    },
    ip: String,
    userAgent: String,
    reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

submissionSchema.index({ formType: 1, status: 1, createdAt: -1 });

export default mongoose.model('Submission', submissionSchema);
