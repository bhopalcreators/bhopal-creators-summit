import jwt from 'jsonwebtoken';
import asyncHandler from '../middleware/asyncHandler.js';
import User, { ROLES } from '../models/User.js';
import AuditLog from '../models/AuditLog.js';

function signToken(userId) {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
}

function sendTokenResponse(user, statusCode, res) {
  const token = signToken(user._id);

  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    // Vercel (frontend) and Render (backend) are different sites, so the cookie needs
    // SameSite=None in production to be sent on cross-site requests. Lax only works
    // locally where both run on http://localhost.
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  };

  res
    .status(statusCode)
    .cookie('token', token, cookieOptions)
    .json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
}

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Email and password are required.' });
  }

  const user = await User.findOne({ email: email.toLowerCase(), deletedAt: null }).select('+password');

  if (!user || !(await user.comparePassword(password))) {
    await AuditLog.create({
      user: user?._id,
      action: 'login_failed',
      resource: 'User',
      ip: req.ip,
    }).catch(() => {});
    return res.status(401).json({ success: false, message: 'Invalid email or password.' });
  }

  if (!user.isActive) {
    return res.status(403).json({ success: false, message: 'This account has been deactivated.' });
  }

  user.lastLoginAt = new Date();
  await user.save();

  await AuditLog.create({ user: user._id, action: 'login', resource: 'User', ip: req.ip });

  sendTokenResponse(user, 200, res);
});

export const logout = asyncHandler(async (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  });
  res.json({ success: true, message: 'Logged out.' });
});

export const getMe = asyncHandler(async (req, res) => {
  res.json({ success: true, user: req.user });
});

// Only super_admin/admin can create staff accounts (enforced via rbac middleware on the route)
export const createUser = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!ROLES.includes(role)) {
    return res.status(400).json({ success: false, message: `Role must be one of: ${ROLES.join(', ')}` });
  }

  // Only super_admin may create another super_admin or admin
  if (['super_admin', 'admin'].includes(role) && req.user.role !== 'super_admin') {
    return res.status(403).json({ success: false, message: 'Only a super admin can create admin-level accounts.' });
  }

  const user = await User.create({ name, email, password, role });

  await AuditLog.create({
    user: req.user._id,
    action: 'create',
    resource: 'User',
    resourceId: user._id,
    after: { name, email, role },
    ip: req.ip,
  });

  res.status(201).json({
    success: true,
    user: { id: user._id, name: user.name, email: user.email, role: user.role },
  });
});

export const listUsers = asyncHandler(async (req, res) => {
  const users = await User.find({ deletedAt: null }).select('-password').sort('-createdAt');
  res.json({ success: true, count: users.length, users });
});

export const updateUser = asyncHandler(async (req, res) => {
  const { name, role, isActive } = req.body;

  if (role && ['super_admin', 'admin'].includes(role) && req.user.role !== 'super_admin') {
    return res.status(403).json({ success: false, message: 'Only a super admin can grant admin-level roles.' });
  }

  const before = await User.findById(req.params.id).select('-password');
  if (!before) return res.status(404).json({ success: false, message: 'User not found.' });

  const updated = await User.findByIdAndUpdate(
    req.params.id,
    { ...(name && { name }), ...(role && { role }), ...(isActive !== undefined && { isActive }) },
    { new: true, runValidators: true }
  ).select('-password');

  await AuditLog.create({
    user: req.user._id,
    action: 'update',
    resource: 'User',
    resourceId: updated._id,
    before,
    after: updated,
    ip: req.ip,
  });

  res.json({ success: true, user: updated });
});

// Soft delete — only admin/super_admin, and never yourself
export const deleteUser = asyncHandler(async (req, res) => {
  if (req.params.id === String(req.user._id)) {
    return res.status(400).json({ success: false, message: 'You cannot delete your own account.' });
  }

  const user = await User.findByIdAndUpdate(req.params.id, { deletedAt: new Date(), isActive: false }, { new: true });
  if (!user) return res.status(404).json({ success: false, message: 'User not found.' });

  await AuditLog.create({
    user: req.user._id,
    action: 'delete',
    resource: 'User',
    resourceId: user._id,
    ip: req.ip,
  });

  res.json({ success: true, message: 'User deactivated.' });
});