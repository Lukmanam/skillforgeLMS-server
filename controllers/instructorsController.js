import Instructor from '../models/instructorModel.js'
import securePassword from '../utilities/securePassword.js';
import { sendMailOtp } from '../utilities/otpControl.js';
import { sendResetpasswordIns } from '../utilities/otpControl.js';
import Course from "../models/courseModel.js";
import Otp from '../models/otpModel.js';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'




let otpId;
export const registerInstructor = async (req, res) => {

    try {
        const { name, email, phone, password } = req.body;
        const emailexist = await Instructor.findOne({ email: email })
        const hashedPassword = await securePassword(password)
        if (emailexist) {
            return res
                .status(401)
                .json({ message: "Already Registered on this email" })
        }
        else {
            const instructor = new Instructor({
                name: name,
                email: email,
                phone: phone,
                password: hashedPassword
            })
            const instructorData = await instructor.save();
            otpId = await sendMailOtp(instructor.name, instructor.email, instructor._id)
            console.log(instructorData, "this is instructor data");
            return res
                .status(201)
                .json({ message: `otp Has been send to ${email}`, instructor: instructorData, otpId: otpId })
        }



    } catch (error) {
        console.log(error);
    }
}



export const instructorEmailOtpVerification = async (req, res) => {
    try {
        const { otp, instructorId } = req.body;
        console.log("instructorId =", instructorId);
        console.log("OTP=", otp);
        const otpData = await Otp.find({ studentId: instructorId });
        console.log(otpData);
        const { expiresAt } = otpData[otpData.length - 1];
        console.log(expiresAt, "This is expiry");
        const correctOtp = otpData[otpData.length - 1].otp;

        if (otpData && expiresAt < Date.now()) {
            return res.status(401).json({ message: "Otp Expired" });
        }
        if (correctOtp === otp) {
            console.log("OTP is Correct");
            await Otp.deleteMany({ studentId: instructorId })
            await Instructor.updateOne({ _id: instructorId }, { $set: { is_verified: true } })
            console.log("Instructor Verified");
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


export const resendInstructorOtp = async (req, res) => {
    try {
        console.log("haaai trying to resend otp");
        const { instructorEmail } = req.body;
        console.log(instructorEmail);
        const { _id, name, email } = await Instructor.findOne({ email: instructorEmail });
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


export const InstructorLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const instructor = await Instructor.findOne({ email: email });
        console.log(instructor);

        if (instructor) {
            const correctPassword = await bcrypt.compare(password, instructor.password)
            console.log(correctPassword, "password correct");
            if (instructor.is_blocked === false) {
                if (correctPassword) {
                    const token = jwt.sign(
                        {
                            name: instructor.name,
                            email: instructor.email,
                            id: instructor._id,
                            role: "instructor"
                        },
                        process.env.INSTRUCTOR_SECRET,
                        { expiresIn: "1h" }
                    );
                    console.log(token);
                    res.status(200).json({ instructor, token, message: `welcome ${instructor.name}` })
                }
                else {
                    res.status(403).json({ message: "Invalid Credentials" })

                }
            }
            else {
                res.status(403).json({ message: "oops!! YourAccount has been Suspended" })
            }
        }

    } catch (error) {
        console.log(error.message);
        res.status(500).json({ status: "Internal Server Error" })
    }
}


export const instructorforgotpassword = async (req, res) => {
    console.log("Instructor forgot Password Backend");
    const { email } = req.body;
    const instructorData = await Instructor.findOne({ email: email })
    console.log(instructorData);
    if (instructorData) {
        await sendResetpasswordIns(instructorData.name, instructorData.email, instructorData._id)

        res.status(201).json({ instructorData, message: "Please Check Your email" })

    }
    else {
        console.log("Ingane oru Instructor Illa");
        res.status(404).json({ message: "Email Not found please Try Again" })
    }


}




export const changePassword = async (req, res) => {
    try {
        console.log("helo trying to change instructor Password");
        const { id, newPassword } = req.body
        const hashedPassword = await securePassword(newPassword)
        console.log(id, "this is instructor Id");
        console.log(newPassword, "this NEW Paswword");

        const instructorData = await Instructor.findByIdAndUpdate({ _id: id }, { $set: { password: hashedPassword } });
        console.log("password has been changed in Instructor ");
        res.status(201).json({ message: "Password Changed Successfully" })
    } catch (error) {
        res.status(500).json({ message: "Internal server error" })

    }
}



export const googleSignins = async (req, res) => {
    try {
        console.log("In Google signin");
        const userData = req.body.user
        const { email, displayName } = userData;
        const instructorData = await Instructor.findOne({ email: email })
        if (instructorData) {
            const token = jwt.sign({ id: instructorData._id }, process.env.INSTRUCTOR_SECRET);
            const { password: pass, ...rest } = instructorData._doc;
            console.log("Instructor Can Login");

            res.status(200)
                .json({ instructorData, token, message: `Welcome Back ${instructorData.name}` })
        }
        else {
            const autoPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
            const hashedPassword = await securePassword(autoPassword);
            const instructor = new Instructor({
                name: displayName,
                email: email,
                password: hashedPassword
            })
            const newInstructor = await instructor.save();
            const instructorData = await Instructor.findOne({ email: email })
            console.log(instructorData.email, "this is email");
            const changed = await Instructor.findOneAndUpdate({ email: instructorData.email }, { $set: { is_verified: true } })
            console.log(changed, "NEW INSTRUCTOR DATA");
            const token = jwt.sign({ id: instructor._id }, process.env.INSTRUCTOR_SECRET);
            console.log("New User Registered with Google Account");
            const { password: pass, ...rest } = instructor._doc;
            res.status(200).json({ instructorData, token, message: `Welcome  ${newInstructor.name}` })

        }
    } catch (error) {

        res.status(500).json({ message: "Internal Server Error" })
        console.log(error);

    }
}

export const myCourses = async (req, res) => {
    try {

        const { instructorId } = req.params
        console.log("in backend", instructorId);
        const courses = await Course.find({ instructorId: instructorId }).populate('category');
        if (courses) {
            console.log(courses, "this is populated Course");
            res.status(200).json({ courses })
        }
    } catch (error) {
        console.log(error);

    }

}


export const fetchCouseData = async (req, res) => {
    try {
        console.log(req.params, "body ");
        const { courseId } = req.params
        console.log(courseId);
        const courseData = await Course.findOne({ _id: courseId }).populate('category').populate('modules.module');
        console.log(courseData);
        res.status(200).json({ message: "course data fetched Successfully", courseData })

    } catch (error) {
        console.log(error);

    }

}

export const changeListStatus = async (req, res) => {
    console.log("haaai")
    const { courseId } = req.body;
    console.log(courseId);
    const courseDetail = await Course.findOne({ _id: courseId })

    if (courseDetail?.is_Listed === true) {
        await Course.findByIdAndUpdate({ _id: courseId }, { $set: { is_Listed: false } })
        const is_Listed = false;
        res?.status(200).json({ message: "Listing Stopped temporarily", is_Listed })
    }
    else {
        await Course.findByIdAndUpdate({ _id: courseId }, { $set: { is_Listed: true } });
        const is_Listed = false;
        res?.status(200).json({ message: "Course Listed Successfully", is_Listed })
    }
}

export const checkListStatus = async (req, res) => {
    try {
        const { courseId } = req.params
        console.log(courseId, "checking List status")
        const courseData = await Course.findOne({ _id: courseId })
        const status = courseData?.is_Listed
        console.log(status);
        res?.status(200).json({ status })

    } catch (error) {
        console.log(error);
    }
}



export const EditinstructorProfile = async (req, res) => {
    console.log(req.body);
    const { instructorId, name, phone } = req.body

    console.log(instructorId, name, phone);

    await Instructor.updateOne({ _id: instructorId }, { $set: { name: name, phone: phone } })
    const updatedInstructor = await Instructor.findById({ _id: instructorId })
    res.status(200).json({ message: "success", updatedInstructor, })


}

export const instructorDatainChat = async (req, res) => {
    try {
        const { instructorId } = req.params;
        const instructor = await Instructor.findOne({ _id: instructorId });
        console.log(instructor, "Instructor in chat");
        res.status(200).json({ instructor })
    } catch (error) {
        console.log(error);
    }
}





