import express from 'express';
import {
  register,
  login,
  changePassword,
  getMe,
  updateProfile,
  deleteMe,
  verify,
  uploadProfileImage,
  deleteProfileImage,
} from '../controllers/AuthController';
import auth from '../middleware/Auth';
import profileImageUpload from '../config/profileImageMulter';
const router = express.Router();

router.post('/register', register);

router.post('/verify', verify);

router.post('/login', login);

router.get('/me', auth(), getMe);

router.patch('/me/change-password', auth(), changePassword);

router.patch('/me', auth(), updateProfile);

router.post(
  '/me/profile-image',
  auth(),
  profileImageUpload.single('profileImage'),
  uploadProfileImage,
);

router.delete('/me/profile-image', auth(), deleteProfileImage);

router.delete('/me', auth(), deleteMe);

export default router;
