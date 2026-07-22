import { Router } from 'express';
import PreviousYear from '../models/PreviousYear.js';
import { createCrudController } from '../controllers/crudControllerFactory.js';
import { protect } from '../middleware/auth.js';
import { requirePermission } from '../middleware/rbac.js';
import asyncHandler from '../middleware/asyncHandler.js';

const router = Router();

const crud = createCrudController(PreviousYear, {
  modelName: 'PreviousYear',
  searchFields: ['theme', 'overview'],
  defaultSort: '-year',
});

// Full year page: /api/previous-years/2024 — everything the page needs in one call
const getBySlug = asyncHandler(async (req, res) => {
  const item = await PreviousYear.findOne({ slug: req.params.slug, deletedAt: null })
    .populate('speakers')
    .populate('agenda')
    .populate('workshops')
    .populate('competitions')
    .populate('partners')
    .populate('sponsors')
    .populate('galleryAlbum')
    .populate('testimonials')
    .populate('faqs');

  if (!item) return res.status(404).json({ success: false, message: 'That year has not been published yet.' });
  res.json({ success: true, item });
});

router.get('/', crud.list);
router.get('/slug/:slug', getBySlug);
router.get('/:id', crud.getOne);

router.post('/', protect, requirePermission('previousYears', 'create'), crud.create);
router.put('/:id', protect, requirePermission('previousYears', 'update'), crud.update);
router.delete('/:id', protect, requirePermission('previousYears', 'delete'), crud.remove);

export default router;
