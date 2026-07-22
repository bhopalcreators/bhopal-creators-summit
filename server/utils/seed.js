import 'dotenv/config';
import { connectDB } from '../config/db.js';
import mongoose from 'mongoose';

import User from '../models/User.js';
import SiteSettings from '../models/SiteSettings.js';
import HeroSlide from '../models/HeroSlide.js';
import Stat from '../models/Stat.js';
import Sponsor from '../models/Sponsor.js';
import Competition from '../models/Competition.js';
import Workshop from '../models/Workshop.js';
import Award from '../models/Award.js';
import Activity from '../models/Activity.js';
import Testimonial from '../models/Testimonial.js';
import AgendaItem from '../models/AgendaItem.js';
import Ticket from '../models/Ticket.js';
import FAQ from '../models/FAQ.js';

async function seed() {
  await connectDB();
  console.log('Seeding database...');

  // --- Super admin ---
  const adminEmail = process.env.SEED_ADMIN_EMAIL || 'admin@bhopalcreatorssummit.in';
  const adminPassword = process.env.SEED_ADMIN_PASSWORD || 'ChangeMe123!';
  const existingAdmin = await User.findOne({ email: adminEmail });
  if (!existingAdmin) {
    await User.create({
      name: 'Super Admin',
      email: adminEmail,
      password: adminPassword,
      role: 'super_admin',
    });
    console.log(`Created super admin: ${adminEmail} / ${adminPassword} (change this password immediately)`);
  } else {
    console.log('Super admin already exists, skipping.');
  }

  // --- Site settings ---
  await SiteSettings.findOneAndUpdate(
    { singletonKey: 'main' },
    {
      singletonKey: 'main',
      brandName: 'iAMA Bhopali Creator',
      eventName: 'Bhopal Creators Summit 2025',
      tagline: 'UNITE. CREATE. CELEBRATE.',
      eventDateLabel: '31 AUG',
      venueName: 'Hotel Pride Kolar',
      venueFullAddress: 'Hotel Pride Kolar, Bhopal',
      contactEmail: 'bhopalcreatorssummit@gmail.com',
      contactPhones: ['+91 91 79 5523 97', '+91-8319527668'],
      footerAbout:
        "The Bhopal Creators Summit brings India's creative minds together in the heart of Madhya Pradesh. Fueled by digital ambition and cultural roots, it's more than a SUMMIT—it's a MOVEMENT.",
    },
    { upsert: true }
  );

  // --- Hero ---
  await HeroSlide.deleteMany({});
  await HeroSlide.create({
    title: 'iAMA Bhopali Creator',
    dateLabel: '31 AUG',
    venueLabel: 'HOTEL PRIDE KOLAR',
    ctaButtons: [
      { label: 'Awards', href: '#awards', variant: 'flare' },
      { label: 'Workshops', href: '#workshops', variant: 'flare' },
      { label: 'Competitions', href: '#competitions', variant: 'flare' },
      { label: 'Tickets Live Now', href: '#tickets', variant: 'light' },
    ],
    order: 0,
    isActive: true,
  });

  // --- Stats ---
  await Stat.deleteMany({});
  await Stat.insertMany([
    { value: '450+', label: 'Creators Attended', order: 0 },
    { value: '20M+', label: 'Overall Reach', order: 1 },
    { value: '1L+', label: 'Impressions', order: 2 },
    { value: '20+', label: 'Brands Associations', order: 3 },
    { value: '\u221E', label: 'Networking', order: 4 },
  ]);

  // --- Sponsors ---
  await Sponsor.deleteMany({});
  await Sponsor.insertMany(
    [
      'SAM Global University',
      'Ratnesh Communications',
      'Snapchat',
      'Canon',
      'Pride Hotel Bhopal',
      'OM System',
      '94.3 My FM',
      'bv',
      'Vistaar WebX',
      'US Media Works',
    ].map((name, i) => ({ name, tier: 'partner', order: i }))
  );

  // --- Competitions ---
  await Competition.deleteMany({});
  await Competition.insertMany([
    {
      title: 'Photography',
      slug: 'photography',
      shortDescription:
        'Hey photographers! Ready to show MP the way you see it? Your vision. Your lens. Your rules.',
      order: 0,
    },
    {
      title: 'Content Collaboration',
      slug: 'collabverse-2025',
      shortDescription:
        'A unique virtual competition where creators from different art forms collaborate to make something original.',
      body: 'CollabVerse 2025 \u2014 A Virtual Creative Collaboration Challenge. Solo registrations only; you\u2019ll be paired with a creator you\u2019ve never worked with before to co-create an original piece over a 7\u201310 day window.',
      rules: [
        'Creators must not know each other prior to the event or have previously collaborated.',
        'Only solo registrations are allowed.',
        'Final output must be a co-created original work created exclusively for this challenge.',
        'Only one entry per team is allowed.',
        'Communication, brainstorming, and planning must be done virtually.',
        'All genres and content types are welcome \u2014 ensure that your final piece is shareable digitally.',
        'Maintain mutual respect \u2014 this is a co-creation, not a competition within teams.',
        'Use of AI tools (for art, audio, or text) is allowed only if transparently disclosed.',
        'Content must not contain hate speech, nudity, plagiarism, or offensive themes.',
        'Late submissions without prior approval will be automatically disqualified.',
      ],
      order: 1,
    },
  ]);

  // --- Workshops ---
  await Workshop.deleteMany({});
  await Workshop.insertMany([
    { title: 'AI Integration in Content', facilitatorName: 'Naman Deshmukh', description: 'Decode the future\u2014how AI can power up your content game.', order: 0 },
    { title: 'Entrepreneurship', facilitatorName: 'Harsh Surana', description: 'From ideas to income\u2014build, brand, and break through.', order: 1 },
    { title: 'Theatre Workshop', description: 'Channel emotion, own the stage\u2014where stories come alive.', order: 2 },
    { title: 'Marketing Workshop', description: 'Crack the algorithm\u2014turn attention into audience.', order: 3 },
    { title: 'Photography & Videography', description: 'Frame it, shoot it, tell it\u2014craft visuals that stop the scroll.', order: 4 },
    { title: 'Music Workshop', description: 'Find your sound and learn to share it with the room.', order: 5 },
  ]);

  // --- Awards ---
  await Award.deleteMany({});
  const year = 2025;
  await Award.insertMany(
    [
      ['Most Engaging Male Creator', "Every post, a hook\u2014he's got the audience on their toes."],
      ['Most Engaging Female Creator', 'She doesn\u2019t just post, she pulls you in\u2014scroll-stopping energy.'],
      ['Most Influential Male Creator', 'More than followers\u2014it\u2019s the ripple effect of his voice.'],
      ['Most Influential Female Creator', 'When she speaks, trends follow\u2014impact beyond numbers.'],
      ['Creator of the Year', 'The all-rounder who raised the bar and redefined the game.'],
      ['Most Innovative Creator', 'For the one who dared to do different\u2014and nailed it.'],
      ['Trendsetter of the Year', "They didn't follow trends, they made them."],
      ['Community Champion', 'Building, supporting, uplifting\u2014a creator who creates space for others.'],
      ['Most Consistent Creator', 'No off days\u2014just pure, passionate posting day after day.'],
      ['Creator for Social Impact', 'For using content as a catalyst for change.'],
      ['Storyteller of the Year', 'Words, visuals, or reels\u2014they turn stories into magic.'],
      ['Visual Aestheticist', 'Painting the city through the lens\u2014beauty, culture, and soul.'],
      ['Best Collaborative Creator', 'Teamwork that hits different\u2014creating magic with others.'],
      ['Creator Beyond Age', 'Proof that great content has no age limit.'],
      ['Fastest Growing Influencer', 'From unknown to unstoppable\u2014skyrocketing reach, one post at a time.'],
    ].map(([title, description], i) => ({ title, description, year, order: i }))
  );

  // --- Activities ---
  await Activity.deleteMany({});
  await Activity.insertMany([
    { title: 'Photography Exhibition', description: '50 frames. Endless stories. A visual love letter to Madhya Pradesh.', order: 0 },
    { title: 'Panel Discussion with Top-Tier Creators', description: 'Real talk, raw journeys, and unfiltered insights from the best in the game.', order: 1 },
    { title: '6 Workshops Across Different Categories', description: 'Skill up, level up \u2014 hands-on sessions to fuel your creative fire.', order: 2 },
  ]);

  // --- Testimonials ---
  await Testimonial.deleteMany({});
  await Testimonial.insertMany([
    { handle: '@nanukasafar', quote: 'Honoured to receive the Youngest Creator Award.', year: 2024, order: 0 },
    { handle: '@bazarvilleindia', quote: 'This event truly pushed our creative boundaries.', year: 2024, order: 1 },
    { handle: '@techplusgadgets', quote: 'One of the best creator events I\u2019ve ever been part of.', year: 2024, order: 2 },
  ]);

  // --- Tickets ---
  await Ticket.deleteMany({});
  await Ticket.insertMany([
    { label: 'FIRST 100', slug: 'first100', price: 300, eventDate: new Date('2025-08-31'), totalStock: 100, soldCount: 100, status: 'sold-out', order: 0 },
    { label: 'Early Bird', slug: 'early-bird', price: 500, originalPrice: 750, eventDate: new Date('2025-08-31'), status: 'available', order: 1 },
    { label: 'Standard', slug: 'standard', price: 750, eventDate: new Date('2025-08-31'), salesStartAt: new Date('2025-08-25'), status: 'upcoming', order: 2 },
    { label: 'CollabVerse Competition Pass', slug: 'collabverse', price: 300, status: 'available', order: 3 },
  ]);

  // --- FAQs ---
  await FAQ.deleteMany({});
  await FAQ.insertMany([
    { question: 'Can I choose my partner?', answer: 'Pairings for CollabVerse are matched by our team based on genre diversity \u2014 you won\u2019t know your partner beforehand.', category: 'collabverse', order: 0 },
    { question: 'What if my genre doesn\u2019t match with my partner\u2019s?', answer: 'That\u2019s the challenge! Embrace the contrast. You\u2019re encouraged to blend ideas, explore new formats, and create something hybrid and original.', category: 'collabverse', order: 1 },
    { question: 'What format should our final output be in?', answer: 'Any digitally shareable format \u2014 video, mixed media, a reel, or a performance recording all work.', category: 'collabverse', order: 2 },
    { question: 'Do I retain rights to my work?', answer: 'Yes, creators retain rights to their submitted work.', category: 'collabverse', order: 3 },
    { question: 'What if my partner drops out mid-way?', answer: 'Reach out to the organizing team immediately and we\u2019ll help re-pair or advise on next steps.', category: 'collabverse', order: 4 },
    { question: 'Will this be conducted virtually?', answer: 'Yes \u2014 all communication, planning, and collaboration happens virtually.', category: 'collabverse', order: 5 },
  ]);

  // --- Agenda ---
  await AgendaItem.deleteMany({});
  await AgendaItem.insertMany([
    {
      title: 'Power-Packed Workshops',
      timeLabel: '11:00 AM \u2013 2:00 PM',
      description: 'Dive into 6 workshops happening in parallel:',
      subItems: [
        'AI Integration in content',
        'Marketing Workshop',
        'Entrepreneurship Workshop',
        'Photography & Videography',
        'Theatre & Acting',
        'Music Workshop',
        'Stage Presence',
      ],
      order: 0,
    },
    { title: 'Panel Discussions & Keynote Sessions', timeLabel: '2:30 PM \u2013 4:30 PM', subItems: [], order: 1 },
    { title: 'Awards & Performances', timeLabel: '5:00 PM \u2013 8:00 PM', subItems: [], order: 2 },
    { title: 'Live Music & DJ Night', timeLabel: '8:30 PM \u2013 10:00 PM', subItems: [], order: 3 },
  ]);

  console.log('Seed complete.');
  await mongoose.connection.close();
  process.exit(0);
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
