import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

// Public site accounts — people who register/log in on the website itself
// (attendees, volunteers, etc). Kept separate from server/models/User.js,
// which is exclusively for staff/admin panel accounts with RBAC roles.
const attendeeSchema = new mongoose.Schema(
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
    phone: { type: String, trim: true },
    password: { type: String, required: true, minlength: 8, select: false },
    isActive: { type: Boolean, default: true },
    lastLoginAt: { type: Date },
  },
  { timestamps: true }
);

attendeeSchema.pre('save', async function hashPassword() {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 12);
});

attendeeSchema.methods.comparePassword = function comparePassword(candidate) {
  return bcrypt.compare(candidate, this.password);
};

export default mongoose.model('Attendee', attendeeSchema);