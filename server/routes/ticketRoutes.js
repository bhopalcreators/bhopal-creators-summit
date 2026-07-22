import { Router } from 'express';
import { ticketCrud, reserveTicket } from '../controllers/ticketController.js';
import { protect } from '../middleware/auth.js';
import { requirePermission } from '../middleware/rbac.js';

const router = Router();

router.get('/', ticketCrud.list);
router.get('/:id', ticketCrud.getOne);
router.post('/:id/reserve', reserveTicket); // public — called at checkout time

router.post('/', protect, requirePermission('content', 'create'), ticketCrud.create);
router.put('/:id', protect, requirePermission('content', 'update'), ticketCrud.update);
router.patch('/reorder', protect, requirePermission('content', 'update'), ticketCrud.reorder);
router.delete('/:id', protect, requirePermission('content', 'delete'), ticketCrud.remove);

export default router;
