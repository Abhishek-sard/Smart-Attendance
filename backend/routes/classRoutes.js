const express = require('express');
const router = express.Router();
const { getClasses, createClass, addStudentToClass } = require('../controllers/classController');
const { verifyToken, authorizeRoles } = require('../middleware/authMiddleware');

router.use(verifyToken);

router.get('/', authorizeRoles('admin', 'teacher'), getClasses);
router.post('/', authorizeRoles('admin'), createClass);
router.put('/:id/student', authorizeRoles('admin', 'teacher'), addStudentToClass);

module.exports = router;
