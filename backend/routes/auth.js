import express from 'express';
import { addUser, loginUser } from '../controllers/authController.js';
import { verifyToken, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.post('/add-user', addUser); // Admin-only in real scenario, can protect later
router.post('/login', loginUser);

// Example protected route
router.get('/dashboard', verifyToken, authorizeRoles('admin', 'hr'), (req, res) => {
  res.json({ message: `Welcome ${req.user.role} to the dashboard` });
});

export default router;
