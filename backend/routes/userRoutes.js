import express from "express";
import { getUsers, createUser, deleteUser } from '../controllers/userController.js';
import { verifyToken, authorizeRoles } from '../middleware/authMiddleware.js';
const router = express.Router();

// All routes here require Admin role
router.use(verifyToken);
router.use(authorizeRoles('admin'));

router.get('/', getUsers);
router.post('/', createUser);
router.delete('/:id', deleteUser);

export default router;
