import { Router } from 'express';
import { createCrudController } from '../controllers/crudControllerFactory.js';
import { protect } from '../middleware/auth.js';
import { requirePermission } from '../middleware/rbac.js';

/**
 * createCrudRouter(Model, { resourceKey, ...options })
 * resourceKey is the permission key checked against ROLE_PERMISSIONS
 * (e.g. 'content' for most homepage sections, 'previousYears', 'faqs').
 */
export function createCrudRouter(Model, { resourceKey = 'content', ...options } = {}) {
  const router = Router();
  const { list, getOne, create, update, remove, reorder } = createCrudController(Model, options);

  // Public reads — the live site fetches published content with no auth
  router.get('/', list);
  router.get('/:id', getOne);

  // Writes require auth + permission for this resource
  router.post('/', protect, requirePermission(resourceKey, 'create'), create);
  router.put('/:id', protect, requirePermission(resourceKey, 'update'), update);
  router.patch('/reorder', protect, requirePermission(resourceKey, 'update'), reorder);
  router.delete('/:id', protect, requirePermission(resourceKey, 'delete'), remove);

  return router;
}
