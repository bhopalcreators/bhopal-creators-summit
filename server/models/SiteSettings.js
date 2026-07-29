import mongoose from 'mongoose';

const socialLinkSchema = new mongoose.Schema(
  { platform: String, url: String, isActive: { type: Boolean, default: true } },
  { _id: false }
);

const siteSettingsSchema = new mongoose.Schema(
  {
    // Using a fixed key so there's always exactly one settings document
    singletonKey: { type: String, default: 'main', unique: true },

    brandName: { type: String, default: 'iAMA Bhopali Creator' },
    eventName: { type: String, default: 'Bhopal Creators Summit 2025' },
    tagline: { type: String, default: 'UNITE. CREATE. CELEBRATE.' },
    logoUrl: String,
    faviconUrl: String,

    eventDate: Date,
    eventDateLabel: String, // e.g. "31 AUG"
    venueName: String,
    venueFullAddress: String,
    venueMapEmbedUrl: String,

    contactEmail: String,
    contactPhones: [String],

    socialLinks: [socialLinkSchema],

    theme: {
      primaryColor: { type: String, default: '#ff5a1f' },
      secondaryColor: { type: String, default: '#e0a640' },
      backgroundColor: { type: String, default: '#0a0a0a' },
    },

    seoDefaults: {
      metaTitle: String,
      metaDescription: String,
      keywords: [String],
      ogImage: String,
      twitterHandle: String,
    },

    announcementBar: {
      isActive: { type: Boolean, default: false },
      message: String,
      linkUrl: String,
    },

    footerAbout: String,

    // Google Form (or any external URL) the hero "Volunteer" button links to
    volunteerFormUrl: String,
  },
  { timestamps: true }
);

export default mongoose.model('SiteSettings', siteSettingsSchema);