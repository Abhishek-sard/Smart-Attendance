
import mongoose from 'mongoose';

const classSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true, // e.g., "Computer Science A"
    },
    subjectCode: {
        type: String,
        required: true, // e.g., "CS101"
    },
    department: {
        type: String,
        required: true,
    },
    location: {
        latitude: Number,
        longitude: Number,
        radius: {
            type: Number,
            default: 100 // meters
        }
    },
    teacher: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    students: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],
    schedule: [{
        day: String, // "Monday"
        startTime: String, // "10:00"
        endTime: String, // "11:00"
    }],
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

export default mongoose.model('Class', classSchema);
