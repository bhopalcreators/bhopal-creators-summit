import { Router } from 'express';
import { login, logout, getMe, createUser, listUsers, updateUser, deleteUser } from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';
import { requireRole } from '../middleware/rbac.js';
import { loginLimiter } from '../middleware/rateLimiters.js';

const router = Router();

router.post('/login', loginLimiter, login);
router.post('/logout', logout);
router.get('/me', protect, getMe);

// Only super_admin/admin manage staff accounts
router.get('/users', protect, requireRole('super_admin', 'admin'), listUsers);
router.post('/users', protect, requireRole('super_admin', 'admin'), createUser);
router.put('/users/:id', protect, requireRole('super_admin', 'admin'), updateUser);
router.delete('/users/:id', protect, requireRole('super_admin', 'admin'), deleteUser);

export default router;
