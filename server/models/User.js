import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

export const ROLES = [
  'super_admin',
  'admin',
  'editor',
  'content_manager',
  'volunteer_manager',
  'media_manager',
  'viewer',
];

// What each role can do, keyed by resource. '*' means all actions.
// Checked by the requirePermission middleware — see middleware/rbac.js
export const ROLE_PERMISSIONS = {
  super_admin: { '*': ['create', 'read', 'update', 'delete'] },
  admin: {
    '*': ['create', 'read', 'update', 'delete'],
    users: ['create', 'read', 'update'], // cannot delete users
  },
  editor: {
    content: ['create', 'read', 'update', 'delete'],
    previousYears: ['create', 'read', 'update', 'delete'],
    faqs: ['create', 'read', 'update', 'delete'],
    users: ['read'],
  },
  content_manager: {
    content: ['create', 'read', 'update'],
    previousYears: ['create', 'read', 'update'],
    faqs: ['create', 'read', 'update'],
  },
  volunteer_manager: {
    registrations: ['read', 'update'],
    forms: ['read', 'update'],
  },
  media_manager: {
    media: ['create', 'read', 'update', 'delete'],
    gallery: ['create', 'read', 'update', 'delete'],
  },
  viewer: {
    '*': ['read'],
  },
};

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Invalid email address'],
    },
    password: { type: String, required: true, minlength: 8, select: false },
    role: { type: String, enum: ROLES, default: 'viewer' },
    isActive: { type: Boolean, default: true },
    lastLoginAt: { type: Date },
    deletedAt: { type: Date, default: null }, // soft delete
  },
  { timestamps: true }
);

userSchema.pre('save', async function hashPassword() {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 12);
});

userSchema.methods.comparePassword = function comparePassword(candidate) {
  return bcrypt.compare(candidate, this.password);
};

userSchema.query.notDeleted = function notDeleted() {
  return this.where({ deletedAt: null });
};

userSchema.index({ role: 1 });

export default mongoose.model('User', userSchema);