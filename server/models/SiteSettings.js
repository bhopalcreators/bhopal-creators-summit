import mongoose from 'mongoose';
import mediaSchema from './shared/mediaSchema.js';

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

    // "About the Summit" section (homepage + /about page)
    about: {
      eyebrow: { type: String, default: 'UNITE. CREATE. CELEBRATE.' },
      title: { type: String, default: 'About the Summit' },
      paragraphs: { type: [String], default: [] },
      images: [mediaSchema], // collage tiles: [0]=top-left square, [1]=top-right square, [2]=wide bottom tile
      highlights: [
        {
          icon: { type: String, default: 'Mic' }, // Mic | Heart | Presentation
          title: String,
          copy: String,
        },
      ],
    },

    // Header nav links, shown on desktop + mobile menu
    navLinks: [
      {
        label: { type: String, required: true },
        href: { type: String, required: true },
      },
    ],

    // Footer "Links" column
    footerLinks: [
      {
        label: { type: String, required: true },
        href: { type: String, required: true },
      },
    ],

    // "3 Years of Bhopal Creators Summit" stat strip on the Our Journey section
    journeyStats: [
      {
        value: { type: String, required: true },
        label: { type: String, required: true },
        sub: String,
      },
    ],

    // "Coming soon" teaser section for next year's edition
    comingSoon: {
      eyebrow: String,
      title: String,
      copy: String,
      notifyHref: String,
      notifyLabel: { type: String, default: 'Follow for Updates' },
    },
  },
  { timestamps: true }
);

export default mongoose.model('SiteSettings', siteSettingsSchema);