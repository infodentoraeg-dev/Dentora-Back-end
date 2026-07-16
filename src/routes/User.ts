import express from 'express';
import {
  deleteUserById,
  getAllUsers,
  getUserById,
  updateUserById,
} from '../controllers/UserController';
const router = express.Router();

router.get('/', getAllUsers);

router.get('/:id', getUserById);

router.patch('/:id', updateUserById);

router.delete('/:id', deleteUserById);

export default router;
