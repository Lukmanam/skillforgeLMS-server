import mongoose from "mongoose";

const SavedCourseSchema=mongoose.Schema({
    courseId:{
        type:mongoose.Types.ObjectId,
        ref:'course',
        required:true
    },
    studentId:{
        type:mongoose.Types.ObjectId,
        ref:'student'
    }
})


export default mongoose.model("favouriteCourse",SavedCourseSchema)