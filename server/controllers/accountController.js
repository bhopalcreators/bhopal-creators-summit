import jwt from 'jsonwebtoken';
import asyncHandler from '../middleware/asyncHandler.js';
import Attendee from '../models/Attendee.js';
import Submission from '../models/Submission.js';

function signToken(attendeeId) {
  return jwt.sign({ id: attendeeId }, process.env.JWT_SECRET, {
    expiresIn: process.env.ATTENDEE_JWT_EXPIRES_IN || '30d',
  });
}

function sendTokenResponse(attendee, statusCode, res) {
  const token = signToken(attendee._id);

  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    // Vercel (frontend) and Render (backend) are different sites, so the cookie needs
    // SameSite=None in production to be sent on cross-site requests. Lax only works
    // locally where both run on http://localhost. Mirrors server/controllers/authController.js.
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    maxAge: 30 * 24 * 60 * 60 * 1000,
  };

  res
    .status(statusCode)
    .cookie('attendee_token', token, cookieOptions)
    .json({
      success: true,
      token,
      attendee: {
        id: attendee._id,
        name: attendee.name,
        email: attendee.email,
        phone: attendee.phone,
      },
    });
}

// Public: create an account. Also drops a matching entry into the existing
// Submission pipeline (formType: 'registration') so it shows up immediately
// under Admin > Form Submissions, right alongside every other form on the
// site — no separate admin screen required.
export const register = asyncHandler(async (req, res) => {
  const { name, email, phone, password, honeypot } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ success: false, message: 'Name, email, and password are required.' });
  }
  if (password.length < 8) {
    return res.status(400).json({ success: false, message: 'Password must be at least 8 characters.' });
  }

  const existing = await Attendee.findOne({ email: email.toLowerCase().trim() });
  if (existing) {
    return res
      .status(409)
      .json({ success: false, message: 'An account with this email already exists. Try logging in instead.' });
  }

  const attendee = await Attendee.create({ name, email, phone, password });

  await Submission.create({
    formType: 'registration',
    fields: { name, email, phone: phone || '' },
    status: honeypot ? 'spam' : 'new',
    ip: req.ip,
    userAgent: req.headers['user-agent'],
  }).catch(() => {});

  sendTokenResponse(attendee, 201, res);
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Email and password are required.' });
  }

  const attendee = await Attendee.findOne({ email: email.toLowerCase().trim() }).select('+password');

  if (!attendee || !(await attendee.comparePassword(password))) {
    return res.status(401).json({ success: false, message: 'Invalid email or password.' });
  }

  if (!attendee.isActive) {
    return res.status(403).json({ success: false, message: 'This account has been deactivated.' });
  }

  attendee.lastLoginAt = new Date();
  await attendee.save();

  sendTokenResponse(attendee, 200, res);
});

export const logout = asyncHandler(async (req, res) => {
  res.clearCookie('attendee_token');
  res.json({ success: true, message: 'Logged out.' });
});

export const getMe = asyncHandler(async (req, res) => {
  res.json({
    success: true,
    attendee: {
      id: req.attendee._id,
      name: req.attendee.name,
      email: req.attendee.email,
      phone: req.attendee.phone,
      createdAt: req.attendee.createdAt,
    },
  });
});