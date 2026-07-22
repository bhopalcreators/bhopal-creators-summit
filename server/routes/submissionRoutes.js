import { Router } from 'express';
import {
  createSubmission,
  listSubmissions,
  updateSubmissionStatus,
  exportSubmissionsCsv,
} from '../controllers/submissionController.js';
import { protect } from '../middleware/auth.js';
import { requirePermission } from '../middleware/rbac.js';
import { submissionLimiter } from '../middleware/rateLimiters.js';

const router = Router();

router.post('/', submissionLimiter, createSubmission);

router.get('/', protect, requirePermission('registrations', 'read'), listSubmissions);
router.get('/export/csv', protect, requirePermission('registrations', 'read'), exportSubmissionsCsv);
router.put('/:id/status', protect, requirePermission('registrations', 'update'), updateSubmissionStatus);

export default router;
