import express from 'express';
import auth from '../middleware/Auth';
import {
  getAllNotifications,
  markNotificationAsRead,
  readAllNotifications,
  deleteNotificationById,
  getMyAllNotifications,
} from '../controllers/NotificationController';

const router = express.Router();

router.get('/', auth(), getAllNotifications);
router.get('/me', auth(), getMyAllNotifications);

router.patch('/:id/read', auth(), markNotificationAsRead);

router.patch('/read-all', auth(), readAllNotifications);

router.delete('/:id', auth(), deleteNotificationById);

export default router;
