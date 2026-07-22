import { Router } from 'express';
import { upload } from '../config/cloudinary.js';
import { uploadSingle, uploadMultiple, deleteAsset, listAssets } from '../controllers/mediaController.js';
import { protect } from '../middleware/auth.js';
import { requirePermission } from '../middleware/rbac.js';

const router = Router();

router.get('/', protect, requirePermission('media', 'read'), listAssets);
router.post('/single', protect, requirePermission('media', 'create'), upload.single('file'), uploadSingle);
router.post('/bulk', protect, requirePermission('media', 'create'), upload.array('files', 20), uploadMultiple);
router.post('/delete', protect, requirePermission('media', 'delete'), deleteAsset);

export default router;
