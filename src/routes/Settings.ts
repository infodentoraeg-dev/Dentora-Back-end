import express from 'express';
const router = express.Router();
import {
  createSettings,
  getSettings,
  updateSettings,
} from '../controllers/SettingsController';
import auth from '../middleware/Auth';

router.post('/', auth(), createSettings);
router.get('/', auth(), getSettings);
router.patch('/', auth(), updateSettings);

export default router;
