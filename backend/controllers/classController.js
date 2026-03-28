
import Class from '../models/Class';


const getClasses = async (req, res) => {
    try {
        let query = {};
        // If teacher, only return their classes
        if (req.user.role === 'teacher') {
            query.teacher = req.user.id;
        }

        const classes = await Class.find(query)
            .populate('teacher', 'name')
            .populate('students', 'name email studentId');

        res.json(classes);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Create a new class
// @route   POST /api/classes
// @access  Private/Admin
const createClass = async (req, res) => {
    try {
        const { name, subjectCode, department, teacher, schedule, students } = req.body;

        const newClass = new Class({
            name,
            subjectCode,
            department,
            teacher,
            schedule,
            students
        });

        const savedClass = await newClass.save();
        res.status(201).json(savedClass);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Add student to class
// @route   PUT /api/classes/:id/student
// @access  Private/Admin/Teacher
const addStudentToClass = async (req, res) => {
    try {
        const classObj = await Class.findById(req.params.id);
        if (!classObj) return res.status(404).json({ message: 'Class not found' });

        const { studentId } = req.body; // User ObjectId

        if (classObj.students.includes(studentId)) {
            return res.status(400).json({ message: 'Student already in class' });
        }

        classObj.students.push(studentId);
        await classObj.save();

        res.json(classObj);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
}

export default { getClasses, createClass, addStudentToClass };
