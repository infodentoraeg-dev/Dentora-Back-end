import express from 'express';
import {
  register,
  login,
  changePassword,
  getMe,
  updateProfile,
  deleteMe,
  verify,
} from '../controllers/AuthController';
import auth from '../middleware/Auth';
const router = express.Router();

router.post('/register', register);

router.post('/verify', verify);

router.post('/login', login);

router.get('/me', auth(), getMe);

router.patch('/change-password', auth(), changePassword);

router.patch('/me', auth(), updateProfile);

router.delete('/me', auth(), deleteMe);

export default router;
