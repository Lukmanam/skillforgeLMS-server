import mongoose from 'mongoose'


const studentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: Number
    },
    password: {
        type: String,
        required: true

    },
    isVerified: {
        type: Boolean,
        default: false
    },
    isBlocked: {
        type: Boolean,
        default: false

    },
    enrolledCourse: [
        {
            course: {
                type: mongoose.Types.ObjectId,
                ref: 'course'
            }
        }
    ]




})


export default mongoose.model("student", studentSchema)