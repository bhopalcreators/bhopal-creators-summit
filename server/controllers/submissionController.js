import asyncHandler from '../middleware/asyncHandler.js';
import Submission from '../models/Submission.js';

// Public: anyone can submit a contact/registration/competition-entry form.
// `honeypot` is a hidden field real users never fill in — bots that
// auto-fill every input trip it and get silently accepted-but-flagged
// instead of erroring (which would tell the bot to try again differently).
export const createSubmission = asyncHandler(async (req, res) => {
  const { formType, honeypot, ticketReference, ...fields } = req.body;

  const validTypes = ['contact', 'registration', 'sponsor_inquiry', 'competition_entry', 'newsletter'];
  if (!validTypes.includes(formType)) {
    return res.status(400).json({ success: false, message: 'Invalid form type.' });
  }

  const isSpam = Boolean(honeypot);

  const submission = await Submission.create({
    formType,
    ticketReference,
    fields,
    status: isSpam ? 'spam' : 'new',
    ip: req.ip,
    userAgent: req.headers['user-agent'],
  });

  // Don't reveal spam detection to the client — respond identically either way
  res.status(201).json({
    success: true,
    message: 'Thanks — your submission has been received.',
    id: submission._id,
  });
});

// Admin: list/filter submissions (volunteer_manager and up)
export const listSubmissions = asyncHandler(async (req, res) => {
  const { formType, status, page = 1, limit = 50 } = req.query;
  const filter = {};
  if (formType) filter.formType = formType;
  if (status) filter.status = status;

  const pageNum = Math.max(Number(page), 1);
  const limitNum = Math.min(Math.max(Number(limit), 1), 200);

  const [items, total] = await Promise.all([
    Submission.find(filter)
      .sort('-createdAt')
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum),
    Submission.countDocuments(filter),
  ]);

  res.json({ success: true, count: items.length, total, page: pageNum, pages: Math.ceil(total / limitNum), items });
});

export const updateSubmissionStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const submission = await Submission.findByIdAndUpdate(
    req.params.id,
    { status, reviewedBy: req.user._id },
    { new: true, runValidators: true }
  );
  if (!submission) return res.status(404).json({ success: false, message: 'Submission not found.' });
  res.json({ success: true, item: submission });
});

// Simple CSV export for admin — no external dependency needed
export const exportSubmissionsCsv = asyncHandler(async (req, res) => {
  const { formType } = req.query;
  const filter = formType ? { formType } : {};
  const submissions = await Submission.find(filter).sort('-createdAt').lean();

  const fieldKeys = [...new Set(submissions.flatMap((s) => Object.keys(s.fields || {})))];
  const header = ['id', 'formType', 'status', 'createdAt', ...fieldKeys];

  const escape = (val) => `"${String(val ?? '').replace(/"/g, '""')}"`;

  const rows = submissions.map((s) =>
    [s._id, s.formType, s.status, s.createdAt.toISOString(), ...fieldKeys.map((k) => s.fields?.[k])]
      .map(escape)
      .join(',')
  );

  const csv = [header.map(escape).join(','), ...rows].join('\n');

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', `attachment; filename="submissions-${Date.now()}.csv"`);
  res.send(csv);
});
