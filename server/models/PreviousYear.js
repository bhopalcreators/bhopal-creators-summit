import mongoose from 'mongoose';
import mediaSchema from './shared/mediaSchema.js';

const winnerSchema = new mongoose.Schema(
  { awardTitle: String, winnerName: String, photo: mediaSchema },
  { _id: false }
);

const statSchema = new mongoose.Schema({ label: String, value: String }, { _id: false });

const timelineEntrySchema = new mongoose.Schema(
  { time: String, title: String, description: String },
  { _id: false }
);

const mediaCoverageSchema = new mongoose.Schema(
  { outlet: String, headline: String, url: String, logo: mediaSchema },
  { _id: false }
);

const downloadableReportSchema = new mongoose.Schema(
  { title: String, file: mediaSchema },
  { _id: false }
);

const previousYearSchema = new mongoose.Schema(
  {
    year: { type: Number, required: true, unique: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true }, // e.g. "2024"
    theme: String,
    overview: String,
    coverImage: mediaSchema,

    statistics: [statSchema], // "450+ Creators Attended" etc, reused per-year
    timeline: [timelineEntrySchema],
    achievements: [String],
    highlights: [String],

    speakers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Speaker' }],
    agenda: [{ type: mongoose.Schema.Types.ObjectId, ref: 'AgendaItem' }],
    workshops: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Workshop' }],
    competitions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Competition' }],
    winners: [winnerSchema],
    partners: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Sponsor' }],
    sponsors: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Sponsor' }],

    galleryAlbum: { type: mongoose.Schema.Types.ObjectId, ref: 'GalleryAlbum' },
    videos: [mediaSchema],
    testimonials: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Testimonial' }],

    downloadableReports: [downloadableReportSchema],
    mediaCoverage: [mediaCoverageSchema],
    closingCeremonyNotes: String,
    faqs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'FAQ' }],

    isPublished: { type: Boolean, default: false },
    seo: {
      metaTitle: String,
      metaDescription: String,
      ogImage: String,
    },
    deletedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

previousYearSchema.index({ year: -1 });

export default mongoose.model('PreviousYear', previousYearSchema);