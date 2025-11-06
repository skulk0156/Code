import express from 'express';
import { addUser, getUsers } from '../controllers/userController.js';

const router = express.Router();

// POST /api/users/add
router.post('/add', addUser);

// GET /api/users
router.get('/', getUsers);

export default router;
