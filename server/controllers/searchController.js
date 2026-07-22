import asyncHandler from '../middleware/asyncHandler.js';
import Speaker from '../models/Speaker.js';
import Sponsor from '../models/Sponsor.js';
import Competition from '../models/Competition.js';
import Workshop from '../models/Workshop.js';
import PreviousYear from '../models/PreviousYear.js';
import { Blog } from '../models/Notice.js';

export const globalSearch = asyncHandler(async (req, res) => {
  const { q } = req.query;
  if (!q || q.trim().length < 2) {
    return res.status(400).json({ success: false, message: 'Provide a search term of at least 2 characters.' });
  }

  const regex = { $regex: q, $options: 'i' };
  const activeFilter = { deletedAt: null };

  const [speakers, sponsors, competitions, workshops, previousYears, blogs] = await Promise.all([
    Speaker.find({ ...activeFilter, name: regex }).limit(10).select('name title category'),
    Sponsor.find({ ...activeFilter, name: regex }).limit(10).select('name tier'),
    Competition.find({ ...activeFilter, title: regex }).limit(10).select('title slug'),
    Workshop.find({ ...activeFilter, title: regex }).limit(10).select('title'),
    PreviousYear.find({ ...activeFilter, $or: [{ theme: regex }, { overview: regex }] }).limit(10).select('year slug theme'),
    Blog.find({ ...activeFilter, status: 'published', title: regex }).limit(10).select('title slug'),
  ]);

  res.json({
    success: true,
    results: {
      speakers,
      sponsors,
      competitions,
      workshops,
      previousYears,
      blogs,
    },
  });
});
