import mongoose from "mongoose";
import Student from "./studentModel.js";


const notificationModel = new mongoose.Schema({
    // from: {
    //     type: String,
    //     required: true
    // },
    text: {
        type: String,
        required: true
    },
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: Student,
        required: true
    },

}, { timestamps: true })


export default mongoose.model('Notification', notificationModel)