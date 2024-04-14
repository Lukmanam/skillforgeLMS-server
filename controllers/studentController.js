import Otp from '../models/otpModel.js';
import Course from '../models/courseModel.js'
import chatModel from '../models/chatModel.js';
import Student from '../models/studentModel.js';
import Category from '../models/categoryModel.js'
import SavedCourse from '../models/SavedCourse.js';
import { sendResetpassword } from '../utilities/otpControl.js'
import EnrolledCourse from '../models/enrolledCourseModel.js';
import notificationModel from '../models/notificationModel.js';
import securePassword from '../utilities/securePassword.js';
import { sendMailOtp } from '../utilities/otpControl.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv';
dotenv.config()



let otpId;
export const studentSignup = async (req, res) => {
    try {
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

            return res.status(201).json({ message: `otp Has been send to ${email}`, student: studentData, otpId: otpId })
        }

    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: "Internal Server Error" })

    }
}


export const emailOtpVerification = async (req, res) => {
    try {
        const { otp, studentId } = req.body;
        const otpData = await Otp.find({ studentId: studentId });
        const { expiresAt } = otpData[otpData.length - 1];
        const correctOtp = otpData[otpData.length - 1].otp;

        if (otpData && expiresAt < Date.now()) {
            return res.status(401).json({ message: "Otp Expired" });
        }
        if (correctOtp === otp) {
            await Otp.deleteMany({ studentId: studentId })
            await Student.updateOne({ _id: studentId }, { $set: { isVerified: true } })
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
        const otpData = await Otp.find({ studentId: studentId });
        const { expiresAt } = otpData[otpData.length - 1];
        const correctOtp = otpData[otpData.length - 1].otp;

        if (otpData && expiresAt < Date.now()) {
            return res.status(401).json({ message: "Otp Expired" });
        }
        if (correctOtp === otp) {
            await Otp.deleteMany({ studentId: studentId })
            await Student.updateOne({ _id: studentId }, { $set: { isVerified: true } })
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
        const { studentEmail } = req.body;
        const { _id, name, email } = await Student.findOne({ email: studentEmail });

        const otpId = sendMailOtp(name, email, _id)
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

        if (studentData) {
            const correctPassword = await bcrypt.compare(password, studentData.password);

            if (correctPassword) {
                if (studentData.isBlocked === false) {
                    const token = jwt.sign(
                        { name: studentData.name, email: studentData.email, id: studentData._id, role: "student" },
                        process.env.STUDENT_SECRET,
                        { expiresIn: "1h", });
                    res.status(200).json({ studentData, token, message: `welcome ${studentData.name}` })
                }
                else {
                    res.status(403).json({ message: "Caution! Account Suspended !!" })
                }
            }
            else {
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
        const { id, newPassword } = req.body
        const hashedPassword = await securePassword(newPassword)
        const studentData = await Student.findByIdAndUpdate({ _id: id }, { $set: { password: hashedPassword } });
        res.status(201).json({ message: "Password Changed Successfully" })
    } catch (error) {
        res.status(500).json({ message: "Internal server error" })

    }
}


export const googleSignin = async (req, res) => {
    try {
        const userData = req.body.user
        const { email, displayName } = userData;
        const studentData = await Student.findOne({ email: email })
        if (studentData) {
            const token = jwt.sign({ id: studentData._id }, process.env.STUDENT_SECRET);
            const { password: pass, ...rest } = studentData._doc;

            res.status(200)
                .json({ studentData, token, message: `Welcome Back ${studentData.name}` })
        }
        else {
            const autoPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
            const hashedPassword = await securePassword(autoPassword);
            const student = new Student({
                name: displayName,
                email: email,
                password: hashedPassword
            })
            const newStudent = await student.save();
            const studentData = await Student.findOne({ email: email })
            const changed = await Student.findOneAndUpdate({ email: studentData.email }, { $set: { isVerified: true } })
            const token = jwt.sign({ id: student._id }, process.env.STUDENT_SECRET);
            const { password: pass, ...rest } = student._doc;
            res.status(200).json({ studentData, token, message: `Welcome  ${newStudent.name}` })

        }
    } catch (error) {

        res.status(500).json({ message: "Internal Server Error" })
        console.log(error);

    }
}


export const allCategories = async (req, res) => {
    const categories = await Category.find({ isBlocked: false });
    res.status(200).json({ message: "Categories for Students", categories })

}

export const allCategoryCoursePage = async (req, res) => {
    const categories = await Category.find({ isBlocked: false });
    res.status(200).json({ message: "Categories for Students", categories })
}

export const allCourses = async (req, res) => {
    const courses = await Course.find({ isApproved: true, is_Listed: true }).populate('instructorId')
    res.status(200).json({ message: "All courses fetched", courses })
}

export const allCourseslist = async (req, res) => {
    const courses = await Course.find({ isApproved: true, is_Listed: true }).populate('instructorId')
    res.status(200).json({ message: "All courses page courses", courses })

}


export const addtoFavCourses = async (req, res) => {
    try {
        const { courseId, studentId } = req.body;
        const alreadyexist = await SavedCourse.findOne({ studentId, courseId });

        if (alreadyexist) {
            await SavedCourse.deleteOne({ courseId, studentId });
            res.status(200).json({ message: "Removed from favourites" });
        } else {
            const savedCourses = new SavedCourse({ courseId, studentId });
            await savedCourses.save();
            res.status(201).json({ message: "Added to Favourites" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const checkfavouriteStatus = async (req, res) => {
    try {
        const { courseId, studentId } = req.body;
        const alreadyexist = await SavedCourse.findOne({ studentId: studentId, courseId: courseId });


        if (alreadyexist !== null && alreadyexist) {
            (course => course.courseId === courseId)
            res.status(200).json({ message: "Checked for favourite or not", favorite: true });
        } else {
            res.status(200).json({ message: "Checked for favourite or not", favorite: false });
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};


export const fetchFavouriteCourses = async (req, res) => {
    try {
        const { studentId } = req.params;
        const favCourses = await SavedCourse.find({ studentId: studentId }).populate('courseId');
        res.status(200).json({ favCourses })

    } catch (error) {
        console.log(error);

    }
}


export const fetchCourseData = async (req, res) => {
    try {
        const { courseId } = req.params;
        const courseData = await Course.find({ _id: courseId }).populate('category').populate('instructorId').populate('modules.module')
        res.status(200).json({ courseData })

    } catch (error) {
        console.log(error);
    }
}

export const enrollToCourse = async (req, res) => {
    try {
        const { courseId, studentId } = req.body

        const alreadyEnrolled = await EnrolledCourse.findOne({ courseId: courseId, studentId: studentId });
        if (alreadyEnrolled) {
            res.status(400).json({ message: "Already Enrolled" })
        }
        else {
            EnrolledCourse.create({
                courseId: courseId,
                studentId: studentId

            })
            const enrolled = await Student.findByIdAndUpdate({ _id: studentId }, { $push: { enrolledCourse: { course: courseId } } });
            res.status(200).json({ message: "Enrolled Successfully", enrolled })
        }
    } catch (error) {
        console.log(error);
    }

}

export const createChat = async (req, res) => {
    try {

        const { studentId, instructorId } = req.body

        const chatExist = await chatModel.findOne({
            members: { $all: [studentId, instructorId] }
        })
        if (!chatExist) {
            const newChat = new chatModel({
                members: [studentId.toString(), instructorId.toString()]
            })
            await newChat.save()
            res.status(200).json({ message: 'Your are connected' })

        }

        const notification = new notificationModel({
            text: 'Your chat created successfully',
            userId: studentId,
        })

        await notification.save()

        res.status(200).json({ message: 'You are connected' })

    } catch (error) {
        console.log(error.message)
    }
}

export const getInstructor = async (req, res) => {
    try {
        const { courseId } = req.params;
        const instructor = await Course.findOne({ _id: courseId })
        res?.status(200).json({ instructor })

    } catch (error) {
        console.log(error);
    }
}

export const checkEnrollment = async (req, res) => {
    const { studentId, courseId } = req.body
    const checkenroll = await EnrolledCourse.findOne({ studentId: studentId, courseId: courseId })

    if (checkenroll) {
        const enrolled = true;
        res.status(200).json({ enrolled });
    }
    else {
        const enrolled = false;
        res.status(200).json({ enrolled });
    }

}


export const fetchEnrolledCourse = async (req, res) => {
    try {

        const { studentId } = req.params
        const enrolledCourses = await EnrolledCourse.find({ studentId: studentId }).populate("courseId")
        res.status(200).json({ enrolledCourses })

    } catch (error) {

    }
}


export const editStudentProfile = async (req, res) => {
    try {
        const { studentId } = req.body;
        const { name, phone, email } = req.body.values
        const update = await Student.findByIdAndUpdate({ _id: studentId }, { $set: { name: name, phone: phone } })
        const updatedprofile = await Student.findOne({ _id: studentId });
        res.status(200).json({ message: "success", updatedprofile })

    } catch (error) {
        console.log(error);
    }
}

export const learnCourse = async (req, res) => {

    try {

        const { courseId } = req.params;
        const course = await Course.findOne({ _id: courseId }).populate('category').populate('instructorId').populate('modules.module');
        res.status(200).json({ course })

    } catch (error) {
        console.log(error);
    }


}


export const rateCourse = async (req, res) => {
    const { rated, review, courseId, studentId } = req.body
    const notAlreadyrated = await EnrolledCourse.findOne({ courseId: courseId, studentId: studentId, rating: { $exists: false } });
    if (notAlreadyrated) {
        const rate = await EnrolledCourse.findOneAndUpdate({ courseId: courseId, studentId: studentId }, { $set: { rating: rated, review: review } });
        res.status(200).json({ rated })
    }
}



export const checkratingStatus = async (req, res) => {
    const courseId = req.query.courseId;
    const studentId = req.query.studentId;
    const ratedOrNot = await EnrolledCourse.findOne({ courseId: courseId, studentId: studentId, rating: { $exists: true } });

    if (ratedOrNot) {
        res.status(200).json({ ratedOrNot, ratingStatus: true })
    }
    else {
        res.status(200).json({ ratingStatus: false })
    }

}


export const fetchCourseRating = async (req, res) => {

    const { courseId } = req.params;
    const documents = await EnrolledCourse.find({ courseId: courseId, rating: { $exists: true } });
    const ratingCount = await EnrolledCourse.find({ courseId: courseId, rating: { $exists: true } }).countDocuments()
    const totalRating = documents.reduce((sum, document) => sum + document.rating, 0);
    const averageRating = totalRating / ratingCount
    res.status(200).json({ averageRating, ratingCount })

}

export const searchCourse = async (req, res) => {
    try {

        const { searchQuery } = req.params;
        const regex = new RegExp(searchQuery, "i");
        const search = await Course.find({
            courseName: { $regex: regex }
        }).populate('instructorId')
        res.status(200).json({ search })
    } catch (error) {
        console.log(error);
    }


}

export const categoryFilter = async (req, res) => {
    const { filterCategory } = req.params;
    const filtered = await Course.find({ category: filterCategory }).populate('instructorId')
    res.status(200).json({ filtered })

}



export const fetchcoursereviews = async (req, res) => {

    const { courseId } = req.params;
    const ratenReviews = await EnrolledCourse.find({ courseId: courseId, review: { $exists: true } }).populate("studentId");
    const ratingCount = await EnrolledCourse.find({ courseId: courseId, rating: { $exists: true } }).countDocuments()
    res.status(200).json({ ratenReviews, ratingCount })

}









