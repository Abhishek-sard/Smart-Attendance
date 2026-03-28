const express = require('express');
const router = express.Router();
const { getUsers, createUser, deleteUser } = require('../controllers/userController');
const { verifyToken, authorizeRoles } = require('../middleware/authMiddleware');

// All routes here require Admin role
router.use(verifyToken);
router.use(authorizeRoles('admin'));

router.get('/', getUsers);
router.post('/', createUser);
router.delete('/:id', deleteUser);

module.exports = router;
