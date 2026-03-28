import express from 'express';
import { Router } from 'express';
import { register, login } from '../controllers/authController';
import { verifyToken } from '../middleware/authMiddleware';


router.post('/register', register);


router.post('/login', login);


router.get('/user', verifyToken, async (req, res) => {
    try {
        const User = require('../models/User');
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

export default router;
