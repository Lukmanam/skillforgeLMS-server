import mongoose from "mongoose";
 const instructorSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    phone:{
        type:Number,
        
    },
    password:{
        type:String,
        required:true
    },
    is_verified:{
        type:Boolean,
        default:false
    },
    is_blocked:{
        type :Boolean,
        default:false
    }

 })

 export default mongoose.model("instructor",instructorSchema)