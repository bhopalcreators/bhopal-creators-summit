import { Router } from 'express';

import authRoutes from './authRoutes.js';
import accountRoutes from './accountRoutes.js';
import settingsRoutes from './settingsRoutes.js';
import uploadRoutes from './uploadRoutes.js';
import ticketRoutes from './ticketRoutes.js';
import submissionRoutes from './submissionRoutes.js';
import previousYearRoutes from './previousYearRoutes.js';
import noticeAndBlogRoutes from './noticeAndBlogRoutes.js';
import { createCrudRouter } from './crudRouterFactory.js';
import { globalSearch } from '../controllers/searchController.js';

import HeroSlide from '../models/HeroSlide.js';
import Stat from '../models/Stat.js';
import Sponsor from '../models/Sponsor.js';
import Competition from '../models/Competition.js';
import Workshop from '../models/Workshop.js';
import Award from '../models/Award.js';
import Activity from '../models/Activity.js';
import Testimonial from '../models/Testimonial.js';
import AgendaItem from '../models/AgendaItem.js';
import Speaker from '../models/Speaker.js';
import FAQ from '../models/FAQ.js';
import GalleryAlbum from '../models/GalleryAlbum.js';
import GalleryImage from '../models/GalleryImage.js';

const router = Router();

// Auth & platform
router.use('/auth', authRoutes);
router.use('/account', accountRoutes); // public site visitor register/login (separate from /auth, which is staff/admin)
router.use('/settings', settingsRoutes);
router.use('/uploads', uploadRoutes);
router.use('/submissions', submissionRoutes);
router.use('/previous-years', previousYearRoutes);
router.get('/search', globalSearch);
router.use(noticeAndBlogRoutes);

// Ticketing (custom stock logic)
router.use('/tickets', ticketRoutes);

// Simple, homogeneous content collections — all CRUD generated
router.use('/hero-slides', createCrudRouter(HeroSlide, { resourceKey: 'content' }));
router.use('/stats', createCrudRouter(Stat, { resourceKey: 'content' }));
router.use('/sponsors', createCrudRouter(Sponsor, { resourceKey: 'content', searchFields: ['name'] }));
router.use('/competitions', createCrudRouter(Competition, { resourceKey: 'content', searchFields: ['title'] }));
router.use('/workshops', createCrudRouter(Workshop, { resourceKey: 'content', searchFields: ['title', 'facilitatorName'] }));
router.use('/awards', createCrudRouter(Award, { resourceKey: 'content', searchFields: ['title'] }));
router.use('/activities', createCrudRouter(Activity, { resourceKey: 'content', searchFields: ['title'] }));
router.use('/testimonials', createCrudRouter(Testimonial, { resourceKey: 'content', searchFields: ['handle', 'quote'] }));
router.use('/agenda', createCrudRouter(AgendaItem, { resourceKey: 'content', searchFields: ['title'] }));
router.use('/speakers', createCrudRouter(Speaker, { resourceKey: 'content', searchFields: ['name'] }));
router.use('/faqs', createCrudRouter(FAQ, { resourceKey: 'faqs', searchFields: ['question'] }));
router.use('/gallery-albums', createCrudRouter(GalleryAlbum, { resourceKey: 'gallery', searchFields: ['title'] }));
router.use('/gallery-images', createCrudRouter(GalleryImage, { resourceKey: 'gallery', populate: ['album'] }));

export default router;