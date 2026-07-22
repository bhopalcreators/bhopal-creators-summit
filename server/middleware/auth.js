import jwt from 'jsonwebtoken';
import asyncHandler from './asyncHandler.js';
import User from '../models/User.js';

export const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (req.cookies?.token) {
    token = req.cookies.token;
  } else if (req.headers.authorization?.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authenticated. Please log in.' });
  }

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    return res.status(401).json({ success: false, message: 'Session expired or invalid. Please log in again.' });
  }

  const user = await User.findOne({ _id: decoded.id, deletedAt: null }).select('-password');
  if (!user || !user.isActive) {
    return res.status(401).json({ success: false, message: 'Account is inactive or no longer exists.' });
  }

  req.user = user;
  next();
});

// Optional auth — attaches user if a valid token exists, but doesn't block the request
export const attachUserIfPresent = asyncHandler(async (req, res, next) => {
  const token = req.cookies?.token || req.headers.authorization?.split(' ')[1];
  if (!token) return next();

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ _id: decoded.id, deletedAt: null }).select('-password');
    if (user?.isActive) req.user = user;
  } catch {
    // invalid/expired token on an optional route — just proceed unauthenticated
  }
  next();
});
