const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');
const { verifyToken } = require('../middleware/authMiddleware');

// @route   POST api/auth/register
// @desc    Register a user (Usually Admin only, but open for initial setup)
// @access  Public (for now)
router.post('/register', register);

// @route   POST api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', login);

// @route   GET api/auth/user
// @desc    Get logged in user
// @access  Private
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

module.exports = router;
