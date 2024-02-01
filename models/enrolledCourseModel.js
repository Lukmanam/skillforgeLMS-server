import { Timestamp } from "mongodb";
import mongoose from "mongoose";

const enrolledSchema = new mongoose.Schema({
    courseId:
    {
        type: mongoose.Types.ObjectId,
        ref: 'course',
        required: true
    },
    studentId: {
        type: mongoose.Types.ObjectId,
        ref: "student",
        required: true
    },
    Progress: {
        type: Array,
        ref: 'module'
    },
    enrolledAt: {
        type: Date,
        default: Date.now()
    },
    rating: {
        type: Number,
        ref: 'course'

    },
    price: {
        type: Number
    }
})

export default mongoose.model("enrolledCourse", enrolledSchema)