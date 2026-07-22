import asyncHandler from '../middleware/asyncHandler.js';
import SiteSettings from '../models/SiteSettings.js';
import AuditLog from '../models/AuditLog.js';

export const getSettings = asyncHandler(async (req, res) => {
  let settings = await SiteSettings.findOne({ singletonKey: 'main' });
  if (!settings) {
    settings = await SiteSettings.create({ singletonKey: 'main' });
  }
  res.json({ success: true, settings });
});

export const updateSettings = asyncHandler(async (req, res) => {
  const before = await SiteSettings.findOne({ singletonKey: 'main' });

  const settings = await SiteSettings.findOneAndUpdate(
    { singletonKey: 'main' },
    { ...req.body, singletonKey: 'main' },
    { new: true, upsert: true, runValidators: true }
  );

  await AuditLog.create({
    user: req.user._id,
    action: 'update',
    resource: 'SiteSettings',
    resourceId: settings._id,
    before,
    after: settings,
    ip: req.ip,
  });

  res.json({ success: true, settings });
});
