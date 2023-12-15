import mongoose from 'mongoose'


const studentSchema=new mongoose.Schema({
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
    required:true
},
password:{
    type:String,
    required:true

},
isVerified:{
    type:Boolean,
    default:false
},
isBlocked:{
    type:Boolean,
    default:false

}

})


export default mongoose.model("student",studentSchema)