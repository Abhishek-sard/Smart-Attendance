const Department = require('../models/Department');

// @desc    Get all departments
// @route   GET /api/departments
// @access  Private/Admin/Teacher
const getDepartments = async (req, res) => {
    try {
        const departments = await Department.find().populate('headOfDepartment', 'name email');
        res.json(departments);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Create a new department
// @route   POST /api/departments
// @access  Private/Admin
const createDepartment = async (req, res) => {
    try {
        const { name, code, headOfDepartment } = req.body;

        let department = await Department.findOne({ code });
        if (department) {
            return res.status(400).json({ message: 'Department already exists' });
        }

        department = new Department({
            name,
            code,
            headOfDepartment
        });

        await department.save();
        res.status(201).json(department);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Delete department
// @route   DELETE /api/departments/:id
// @access  Private/Admin
const deleteDepartment = async (req, res) => {
    try {
        await Department.findByIdAndDelete(req.params.id);
        res.json({ message: 'Department removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

module.exports = { getDepartments, createDepartment, deleteDepartment };
