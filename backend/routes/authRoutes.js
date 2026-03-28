import express from 'express';
import { register, login } from '../controllers/authController.js';
import { verifyToken } from '../middleware/authMiddleware.js';
import User from '../models/User.js';

const router = express.Router();

// Register
router.post('/register', register);

// Login
router.post('/login', login);

// Get Logged-in User
router.get('/user', verifyToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

export default router;