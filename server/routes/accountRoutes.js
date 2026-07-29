import { Router } from 'express';
import { register, login, logout, getMe } from '../controllers/accountController.js';
import { protectAttendee } from '../middleware/attendeeAuth.js';
import { loginLimiter, submissionLimiter } from '../middleware/rateLimiters.js';

const router = Router();

router.post('/register', submissionLimiter, register);
router.post('/login', loginLimiter, login);
router.post('/logout', logout);
router.get('/me', protectAttendee, getMe);

export default router;