import Student from '../models/studentModel.js';
import Otp from '../models/otpModel.js';
import securePassword from '../utilities/securePassword.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'
import { sendMailOtp } from '../utilities/otpControl.js';
import dotenv from 'dotenv';
import { sendResetpassword } from '../utilities/otpControl.js'
import { response } from 'express';

dotenv.config()



let otpId;
export const studentSignup = async (req, res) => {
    try {
        console.log("hellooo");
        const { name, email, phone, password } = req.body
        const emailexist = await Student.findOne({ email: email })
        const hashedPassword = await securePassword(password)
        if (emailexist) {
            return res
                .status(401)
                .json({ message: "Ooops! Already registered with this mail" })
        }
        else {
            const student = new Student({
                name: name,
                email: email,
                phone: phone,
                password: hashedPassword
            })
            const studentData = await student.save();
            otpId = await sendMailOtp(student.name, student.email, student._id);
            console.log(otpId, "this is OTP DETAILS");

            return res.status(201).json({ message: `otp Has been send to ${email}`, student: studentData, otpId: otpId })
        }

    } catch (error) {
        console.log("this is error", error.message);
        res.status(500).json({ message: "Internal Server Error" })

    }
}


export const emailOtpVerification = async (req, res) => {
    try {
        const { otp, studentId } = req.body;
        console.log("studentId=", studentId);
        console.log("OTP=", otp);
        const otpData = await Otp.find({ studentId: studentId });
        console.log(otpData);
        const { expiresAt } = otpData[otpData.length - 1];
        console.log(expiresAt, "This is expiry");
        const correctOtp = otpData[otpData.length - 1].otp;

        if (otpData && expiresAt < Date.now()) {
            return res.status(401).json({ message: "Otp Expired" });
        }
        if (correctOtp === otp) {
            console.log("OTP is Correct");
            await Otp.deleteMany({ studentId: studentId })
            await Student.updateOne({ _id: studentId }, { $set: { isVerified: true } })
            console.log("student Verified");
            res.status(200).json({ message: "Otp verified Successfully, Please Login to Continue" })

        }
        else {
            res.status(400).json({ message: "Incorrect Otp" })
        }
    }
    catch (error) {
        console.log(error.message);
        res.status(400).json({ message: "internal Server Error" })
    }

};


export const forgotemailOtopVerification = async (req, res) => {
    try {
        const { otp, studentId } = req.body;
        console.log("studentId=", studentId);
        console.log("OTP=", otp);
        const otpData = await Otp.find({ studentId: studentId });
        console.log(otpData);
        const { expiresAt } = otpData[otpData.length - 1];
        console.log(expiresAt, "This is expiry");
        const correctOtp = otpData[otpData.length - 1].otp;

        if (otpData && expiresAt < Date.now()) {
            return res.status(401).json({ message: "Otp Expired" });
        }
        if (correctOtp === otp) {
            console.log("OTP is Correct");
            await Otp.deleteMany({ studentId: studentId })
            await Student.updateOne({ _id: studentId }, { $set: { isVerified: true } })
            console.log("student Verified");
            res.status(200).json({ message: "Otp verified Successfully, Change your password Now" })

        }
        else {
            res.status(400).json({ message: "Incorrect Otp" })
        }
    }
    catch (error) {
        console.log(error.message);
        res.status(400).json({ message: "internal Server Error" })
    }
}

export const resendStudentOtp = async (req, res) => {
    try {
        console.log("haaai trying to resend otp");
        const { studentEmail } = req.body;
        console.log(studentEmail);
        const { _id, name, email } = await Student.findOne({ email: studentEmail });
        console.log("this is id", _id);

        const otpId = sendMailOtp(name, email, _id)
        console.log(otpId);
        if (otpId) {
            res.status(200).json({ message: `Otp Has been resend to ${email} ` })
        }
    } catch (error) {
        console.log(error.message);
        return res
            .status(500)
            .json({ message: "Failed to send OTP, try again!" })

    }

}

export const studentLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const studentData = await Student.findOne({ email: email })
        console.log(studentData);

        if (studentData) {
            const correctPassword = await bcrypt.compare(password, studentData.password);

            console.log(correctPassword);
            if (correctPassword) {
                if (studentData.isBlocked === false) {
                    const token = jwt.sign(
                        { name: studentData.name, email: studentData.email, id: studentData._id, role: "student" },
                        process.env.STUDENT_SECRET,
                        { expiresIn: "1h", });
                    console.log(token);
                    res.status(200).json({ studentData, token, message: `welcome ${studentData.name}` })
                }
                else {
                    res.status(403).json({ message: "Caution! Account Suspended !!" })
                }
            }
            else {
                console.log("creadentials not valid");
                res.status(401).json({ message: "Authentication Failed, Invalid Credential" })
            }
        }
        else {
            res.status(401).json({ message: "Authentication Failed, Invalid Credential" })
        }
    }
    catch (error) {

        res.status(500).json({ message: "Internal Server Error" })
    }
}

export const forgotpassword = async (req, res) => {
    const { email } = req.body;
    const studentData = await Student.findOne({ email: email })
    console.log(studentData);
    if (studentData) {
        await sendResetpassword(studentData.name, studentData.email, studentData._id)

        res.status(201).json({ studentData, message: "Please Check Your email" })

    }
    else {
        res.status(404).json({ message: "Email Not found please Try Again" })
    }


}

export const changePassword = async (req, res) => {
    try {
        console.log(req.body);
        const { id, newPassword } = req.body
        const hashedPassword = await securePassword(newPassword)
        const studentData = await Student.findByIdAndUpdate({ _id: id }, { $set: { password: hashedPassword } });
        console.log("password has been changed");
        res.status(201).json({ message: "Password Changed Successfully" })
    } catch (error) {
        res.status(500).json({ message: "Internal server error" })

    }
}


export const googleSignin=async(req,res)=>{
    try {
        console.log("In Google signin");
        const userData=req.body.user
        const {email,displayName}=userData;
        const studentData=await Student.findOne({email:email})
        if(studentData){
            const token=jwt.sign({id:studentData._id},process.env.STUDENT_SECRET);
            const {password:pass, ...rest}=studentData._doc;
            console.log("Student Can Login");

            res.status(200)
            .json({studentData,token,message:`Welcome Back ${studentData.name}`})
        }
        else
        {
            const autoPassword=Math.random().toString(36).slice(-8) +Math.random().toString(36).slice(-8);
            const hashedPassword=await securePassword(autoPassword);
            const student = new Student({
                name: displayName,
                email: email,
                password: hashedPassword
            })
            const newStudent=await student.save();
            const studentData=await Student.findOne({email:email})
            console.log(studentData.email,"this is email");
            const changed=await Student.findOneAndUpdate({email:studentData.email},{$set:{isVerified:true}})
            console.log(changed,"NEW STUDENT DATA");
            const token= jwt.sign({id:student._id},process.env.STUDENT_SECRET);
            console.log("New User Registered with Google Account");
            const {password:pass,...rest}=student._doc;
           res.status(200).json({studentData,token,message:`Welcome  ${newStudent.name}`})

        }
    } catch (error) {

        res.status(500).json({message:"Internal Server Error"})
        console.log(error); 
        
    }
}


