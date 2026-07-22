import { Router } from 'express';
import { Notice, Blog } from '../models/Notice.js';
import { createCrudRouter } from './crudRouterFactory.js';

const router = Router();

router.use('/notices', createCrudRouter(Notice, { resourceKey: 'content', searchFields: ['title'] }));
router.use('/blogs', createCrudRouter(Blog, { resourceKey: 'content', searchFields: ['title', 'excerpt'] }));

export default router;
