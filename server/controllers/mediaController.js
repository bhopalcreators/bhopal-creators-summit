import asyncHandler from '../middleware/asyncHandler.js';
import cloudinary from '../config/cloudinary.js';
import AuditLog from '../models/AuditLog.js';

export const listAssets = asyncHandler(async (req, res) => {
  const { folder = '', nextCursor, resourceType = 'image', maxResults = 40 } = req.query;

  const result = await cloudinary.api.resources({
    type: 'upload',
    resource_type: resourceType,
    prefix: `bhopal-creators-summit/${folder}`.replace(/\/$/, ''),
    max_results: Math.min(Number(maxResults) || 40, 100),
    next_cursor: nextCursor || undefined,
    context: true,
  });

  res.json({
    success: true,
    assets: result.resources.map((r) => ({
      url: r.secure_url,
      publicId: r.public_id,
      type: r.resource_type,
      width: r.width,
      height: r.height,
      createdAt: r.created_at,
      bytes: r.bytes,
    })),
    nextCursor: result.next_cursor || null,
  });
});

export const uploadSingle = asyncHandler(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'No file was uploaded.' });
  }

  const asset = {
    url: req.file.path,
    publicId: req.file.filename,
    type: req.file.mimetype.startsWith('video/') ? 'video' : 'image',
  };

  await AuditLog.create({
    user: req.user._id,
    action: 'create',
    resource: 'Media',
    after: asset,
    ip: req.ip,
  });

  res.status(201).json({ success: true, asset });
});

export const uploadMultiple = asyncHandler(async (req, res) => {
  if (!req.files?.length) {
    return res.status(400).json({ success: false, message: 'No files were uploaded.' });
  }

  const assets = req.files.map((f) => ({
    url: f.path,
    publicId: f.filename,
    type: f.mimetype.startsWith('video/') ? 'video' : 'image',
  }));

  await AuditLog.create({
    user: req.user._id,
    action: 'create',
    resource: 'Media',
    after: { count: assets.length },
    ip: req.ip,
  });

  res.status(201).json({ success: true, assets });
});

export const deleteAsset = asyncHandler(async (req, res) => {
  const { publicId, resourceType = 'image' } = req.body;
  if (!publicId) {
    return res.status(400).json({ success: false, message: 'publicId is required.' });
  }

  await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });

  await AuditLog.create({
    user: req.user._id,
    action: 'delete',
    resource: 'Media',
    before: { publicId },
    ip: req.ip,
  });

  res.json({ success: true, message: 'Asset deleted from Cloudinary.' });
});
