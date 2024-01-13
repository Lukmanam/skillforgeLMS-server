import mongoose from "mongoose";

const courseSchema = mongoose.Schema({
    instructorId: 
    {
       type: mongoose.Types.ObjectId,
       ref:'instructor',
    },
    courseName: {
        type: String,
        required: true
    },
    courseDescription: {
        type: String,
        
    },
    category: {
        type:mongoose.Types.ObjectId,
        ref:'category',
        required:true
        
    },
    price: {
        type: Number,
        required: true
    },
    is_Listed:{
        type:Boolean,
        default:true
    },
    isApproved:{
        type:Boolean,
        default:false
    },
    thumbnail: {
        type: String,
        default: "",
        required: true
    },
    modules:[{
        module:{
            type:mongoose.Types.ObjectId,
            ref:'module'
        }
    }]



})

export default mongoose.model('course', courseSchema)