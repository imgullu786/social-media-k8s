import express from 'express';
import { getNotifications, deleteNotification, deleteNotifications } from '../controllers/notificationController.js';
import protectRoute from '../middleware/protectRoute.js';

const router = express.Router();
router.get('/', protectRoute, getNotifications);
router.delete('/:id', protectRoute, deleteNotification);
router.delete('/', protectRoute, deleteNotifications);


export default router;