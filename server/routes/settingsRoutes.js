import { Router } from 'express';
import { getSettings, updateSettings } from '../controllers/settingsController.js';
import { protect } from '../middleware/auth.js';
import { requirePermission } from '../middleware/rbac.js';

const router = Router();

router.get('/', getSettings);
router.put('/', protect, requirePermission('content', 'update'), updateSettings);

export default router;
