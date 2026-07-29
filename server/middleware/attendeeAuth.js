import jwt from 'jsonwebtoken';
import asyncHandler from './asyncHandler.js';
import Attendee from '../models/Attendee.js';

// Mirrors middleware/auth.js's `protect`, but for public-site accounts.
// Uses its own cookie name (attendee_token) so a logged-in admin session
// and a logged-in attendee session never collide in the same browser.
export const protectAttendee = asyncHandler(async (req, res, next) => {
  let token;

  if (req.cookies?.attendee_token) {
    token = req.cookies.attendee_token;
  } else if (req.headers.authorization?.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Not logged in.' });
  }

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    return res.status(401).json({ success: false, message: 'Session expired or invalid. Please log in again.' });
  }

  const attendee = await Attendee.findById(decoded.id);
  if (!attendee || !attendee.isActive) {
    return res.status(401).json({ success: false, message: 'Account is inactive or no longer exists.' });
  }

  req.attendee = attendee;
  next();
});