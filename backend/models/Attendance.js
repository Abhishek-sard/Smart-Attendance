
import mongoose from 'mongoose';

const attendanceSchema = new mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    class: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Class',
        required: true,
    },
    date: {
        type: Date, // We can store just the date part or full timestamp
        required: true,
        default: Date.now
    },
    status: {
        type: String,
        enum: ['Present', 'Absent', 'Late', 'Excused'],
        default: 'Absent',
    },
    method: {
        type: String,
        enum: ['Manual', 'QR', 'Face', 'GPS'],
        default: 'Manual',
    },
    location: {
        lat: Number,
        lng: Number,
    },
}, { timestamps: true });

// Prevent duplicate attendance for same student, class, and date
// Note: Date needs to be normalized (set to midnight) for this index to work effectively for "daily" attendance
attendanceSchema.index({ student: 1, class: 1, date: 1 }, { unique: true });

export default { mongoose.model('Attendance', attendanceSchema) };
