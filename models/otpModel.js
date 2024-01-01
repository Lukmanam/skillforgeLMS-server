import mongoose from "mongoose";

const otpSchema= new mongoose.Schema({
 studentId:mongoose.Types.ObjectId,
 otp:String,
 createdAt:Date,
 expiresAt:Date   
})

export default mongoose.model('otp',otpSchema)