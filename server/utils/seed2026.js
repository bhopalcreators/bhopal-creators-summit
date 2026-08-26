// Seeds the 2026 Competitions and Activities that are now live (per the
// "Bhopal Creators Summit 2026" tracking sheet). This is a SEPARATE script
// from utils/seed.js on purpose:
//   - it never calls deleteMany() on anything
//   - it never touches a document that isn't one of the ones it creates below
//   - it's safe to re-run: each item is upserted by a stable key (slug for
//     competitions, title+year for activities) so running it twice won't
//     create duplicates or wipe any edits made from the admin panel since
//
// 2026 Workshops aren't in here on purpose — they haven't been announced
// yet. Add them the same way (or straight from /admin/workshops) once they
// are.
//
// Run from the server/ folder:   npm run seed:2026

import 'dotenv/config';
import { connectDB } from '../config/db.js';
import mongoose from 'mongoose';

import Competition from '../models/Competition.js';
import Activity from '../models/Activity.js';

const YEAR = 2026;

const competitions2026 = [
  {
    title: 'Dance Battle',
    slug: 'dance-battle-2026',
    shortDescription: 'Bring your best moves and battle it out on stage — solo or crew, your call.',
    order: 0,
  },
  {
    title: 'Food Vlogger Competition',
    slug: 'food-vlogger-2026',
    shortDescription: 'Camera in one hand, plate in the other — show us how Bhopal eats.',
    order: 1,
  },
  {
    title: 'Gaming',
    slug: 'gaming-2026',
    shortDescription: 'Squad up and battle it out — bragging rights and prizes on the line.',
    order: 2,
  },
  {
    title: 'Photography',
    slug: 'photography-2026',
    shortDescription: 'Your city, your frame, your story — capture Bhopal like only you can.',
    order: 3,
  },
  {
    title: 'Documentary Film',
    slug: 'documentary-film-2026',
    shortDescription: 'Short, sharp and real — tell a true story that needs to be seen.',
    order: 4,
  },
  {
    title: 'Treasure Hunt',
    slug: 'treasure-hunt-2026',
    shortDescription: 'Clues, chaos and creators — race across the city to crack it first.',
    order: 5,
  },
  {
    title: 'AI Creator',
    slug: 'ai-creator-2026',
    shortDescription: 'Prompt it, generate it, own it — show us what AI-powered creativity looks like.',
    order: 6,
  },
];

const activities2026 = [
  { title: 'Bike Rally', description: 'Kick off the season on two wheels — creators riding together through the city.' },
  { title: 'Jamming', description: 'Open mic, open strings — creators jamming together, no script needed.' },
  { title: 'Painting Competition / Wall Art', description: 'Blank walls, bold colours — live painting that turns the venue into a canvas.' },
  { title: 'Cleanliness Drive', description: 'Creators giving back — a community clean-up with content that actually matters.' },
  { title: 'Sports', description: 'Friendly matches, real competition — creators trade cameras for jerseys for a day.' },
  { title: 'Shayari', hostedBy: 'Raghav Singh', description: 'An evening of verses and vibe, hosted by Raghav Singh.' },
  { title: 'Rap Battle', description: 'Bars for bars — an open rap battle for the boldest voices in the room.' },
  { title: 'Fitness', description: 'Sweat it out together — a high-energy fitness session to start the day right.' },
  { title: 'Plantation Drive', description: 'Creators planting more than content — a green initiative for the city.' },
  { title: 'Fashion', hostedBy: 'Tapti Thakur', description: 'A styled walk curated by Tapti Thakur, showcasing Bhopal\u2019s fashion-forward creators.' },
  { title: 'Gen Run', description: 'A community run for every generation of creators — pace optional, energy mandatory.' },
  { title: 'Well-being', description: 'Slow down for a bit — sessions on mindfulness and staying sane in the content grind.' },
  { title: 'Traffic Police', description: 'A collaboration with Bhopal Traffic Police on road safety awareness, creator-style.' },
  { title: 'Singing', description: 'Open floor, open mic — creators showing off their vocal side.' },
  { title: 'Photowalk', description: 'A guided walk through Bhopal\u2019s most photogenic corners, camera in hand.' },
  { title: 'Flash Mob', description: 'Unscripted, unexpected — a flash mob to keep the energy unpredictable.' },
].map((a, i) => ({ ...a, order: i }));

async function seed2026() {
  await connectDB();
  console.log('Seeding 2026 competitions & activities (insert-only, no existing data touched)...');

  let createdCompetitions = 0;
  for (const c of competitions2026) {
    const existing = await Competition.findOne({ slug: c.slug });
    if (existing) {
      console.log(`  - Competition "${c.title}" already exists (slug: ${c.slug}), skipping.`);
      continue;
    }
    await Competition.create({ ...c, year: YEAR });
    createdCompetitions += 1;
  }

  let createdActivities = 0;
  for (const a of activities2026) {
    const existing = await Activity.findOne({ title: a.title, year: YEAR });
    if (existing) {
      console.log(`  - Activity "${a.title}" (${YEAR}) already exists, skipping.`);
      continue;
    }
    await Activity.create({ ...a, year: YEAR });
    createdActivities += 1;
  }

  console.log(`Done. Created ${createdCompetitions} competition(s) and ${createdActivities} activity(ies) for ${YEAR}.`);
  await mongoose.connection.close();
  process.exit(0);
}

seed2026().catch((err) => {
  console.error('2026 seed failed:', err);
  process.exit(1);
});