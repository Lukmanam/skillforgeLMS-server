import mongoose from "mongoose";
const moduleSchema = mongoose.Schema({
    module_title: {
        type: String,
        required: true
    },
    module_order: {
        type: Number,
        required: true

    },
    video_url: {
        type: String,
        required: true
    },
    course: {
        type: mongoose.Types.ObjectId,
        ref: "course",
        required: true
    }

})

export default mongoose.model('module', moduleSchema)