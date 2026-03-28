const Leave = require('../models/Leave');

// @desc    Apply for leave
// @route   POST /api/leaves
// @access  Private/Student
const applyLeave = async (req, res) => {
    try {
        const { startDate, endDate, reason } = req.body;
        const newLeave = new Leave({
            student: req.user.id,
            startDate,
            endDate,
            reason
        });
        const savedLeave = await newLeave.save();
        res.status(201).json(savedLeave);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Get my leaves
// @route   GET /api/leaves/my
// @access  Private/Student
const getMyLeaves = async (req, res) => {
    try {
        const leaves = await Leave.find({ student: req.user.id }).sort({ createdAt: -1 });
        res.json(leaves);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Get all leaves (for Admin/Teacher)
// @route   GET /api/leaves
// @access  Private/Admin/Teacher
const getAllLeaves = async (req, res) => {
    try {
        const leaves = await Leave.find()
            .populate('student', 'name email studentId')
            .sort({ createdAt: -1 });
        res.json(leaves);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Update leave status
// @route   PUT /api/leaves/:id
// @access  Private/Admin/Teacher
const updateLeaveStatus = async (req, res) => {
    try {
        const { status } = req.body; // 'Approved' or 'Rejected'
        const leave = await Leave.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );
        res.json(leave);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

module.exports = { applyLeave, getMyLeaves, getAllLeaves, updateLeaveStatus };
