const express = require('express');
const router = express.Router();
const { getDashboardStats, getClassReport } = require('../controllers/reportController');
const { verifyToken, authorizeRoles } = require('../middleware/authMiddleware');

router.use(verifyToken);
router.use(authorizeRoles('admin', 'teacher'));

router.get('/dashboard-stats', getDashboardStats);
router.get('/class/:classId', getClassReport);

module.exports = router;
