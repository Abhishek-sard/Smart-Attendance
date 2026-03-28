const express = require('express');
const router = express.Router();
const { getDepartments, createDepartment, deleteDepartment } = require('../controllers/departmentController');
const { verifyToken, authorizeRoles } = require('../middleware/authMiddleware');

router.use(verifyToken);

router.get('/', authorizeRoles('admin', 'teacher'), getDepartments);
router.post('/', authorizeRoles('admin'), createDepartment);
router.delete('/:id', authorizeRoles('admin'), deleteDepartment);

module.exports = router;
