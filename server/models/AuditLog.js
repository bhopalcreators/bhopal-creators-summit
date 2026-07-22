import mongoose from 'mongoose';

const auditLogSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    action: { type: String, enum: ['create', 'update', 'delete', 'login', 'login_failed'], required: true },
    resource: { type: String, required: true }, // model name, e.g. "Ticket"
    resourceId: { type: mongoose.Schema.Types.ObjectId },
    before: mongoose.Schema.Types.Mixed,
    after: mongoose.Schema.Types.Mixed,
    ip: String,
  },
  { timestamps: true }
);

auditLogSchema.index({ resource: 1, resourceId: 1 });
auditLogSchema.index({ user: 1, createdAt: -1 });

export default mongoose.model('AuditLog', auditLogSchema);
