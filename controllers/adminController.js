import Jwt from "jsonwebtoken";
import dotenv from "dotenv";
import Student from "../models/studentModel.js";
import Instructor from "../models/instructorModel.js"
import Category from "../models/categoryModel.js"
import Course from "../models/courseModel.js"
import EnrolledCourses from "../models/enrolledCourseModel.js";
dotenv.config();


export const adminLogin = async (req, res) => {
    const adminemail = process.env.Admin_USERNAME;
    const adminpassword = process.env.Admin_PASSWORD;
    const userName = "Admin"
    try {
        const { email, password } = req.body;
        if (adminemail === email && adminpassword === password) {

            const token = Jwt.sign(
                {
                    name: userName,
                    email: adminemail,
                    role: "admin"
                },

                process.env.ADMIN_SECRET,

                {
                    expiresIn: "1h"
                }
            );

            res
                .status(200).json({ userName, token, message: `Welcome ${userName}` })

        }
        else {
            res.status(401).json({ message: "Invalid Credentials!!!\n Please Try again" })
        }

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" })
    }
}


export const studentsList = async (req, res) => {
    try {
        const students = await Student.find();

        res.status(200).json({ students });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const studentBlock = async (req, res) => {
    try {
        const { studentId, status } = req.body
        await Student.findByIdAndUpdate({ _id: studentId }, { $set: { isBlocked: !status } })
        res.status(200).json({ message: "updated" })
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" })

    }
}


export const instructorList = async (req, res) => {
    try {
        const instructors = await Instructor.find();

        res.status(200).json({ instructors });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};



export const instructorBlock = async (req, res) => {
    try {
        const { instructorId, status } = req.body
        await Instructor.findByIdAndUpdate({ _id: instructorId }, { $set: { is_blocked: !status } });
        res.status(200).json({ message: "Internal Server error" })
    } catch (error) {

    }
};
export const fetchCounts = async (req, res) => {
    try {
        const Instructorcount = await Instructor.find().countDocuments();
        const studentsCount = await Student.find().countDocuments();
        const courseCount = await Course.find().countDocuments();
        const ApprovedcourseCount = await Course.find({ isApproved: true }).countDocuments();
        const ActiveInstructors = await Instructor.find({ is_blocked: false }).countDocuments();
        const ActiveStudents = await Student.find({ isBlocked: false }).countDocuments();





        res.status(200).json({ Instructorcount, studentsCount, courseCount, ApprovedcourseCount, ActiveInstructors, ActiveStudents })
    } catch (error) {
        console.log(error);
    }
}
export const addCategory = async (req, res) => {
    try {

        const { categoryName } = req.body;
        const alreadyExist = await Category.findOne({ name: categoryName });
        if (alreadyExist) {
            res.status(400).json({ message: "Category already exist" })
        }
        else {

            const category = new Category({
                name: categoryName
            })
            const saveCategory = await category.save();
            res.status(200).json({ message: "Category Added" })
        }
    } catch (error) {
        console.log(error);
    }
}

export const categoryList = async (req, res) => {
    try {
        const category = await Category.find()

        res
            .status(200).json({ category })
    } catch (error) {
        console.log(error);

    }
}

export const listunlist = async (req, res) => {
    try {

        const { categoryId } = req.body;
        const status = await Category.findOne({ _id: categoryId })
        if (status.isBlocked === true) {
            const updated = await Category.findByIdAndUpdate({ _id: categoryId }, { $set: { isBlocked: false } })
            res.status(200).json({ message: "Listed Successfully", updated })
        }
        else {
            const updated = await Category.findByIdAndUpdate({ _id: categoryId }, { $set: { isBlocked: true } })
            res.status(200).json({ message: "Unlisted Successfully", updated })
        }

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" })
    }


}

export const coursesList = async (req, res) => {
    try {
        const courses = await Course.find().populate('category');
        res.status(200).json({ courses })

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server Error" })

    }
}


export const courseApproval = async (req, res) => {
    try {

        const { courseId } = req.body;
        const courseData = await Course.findOne({ _id: courseId });
        if (courseData) {
            if (courseData.isApproved) {
                const updated = await Course.findByIdAndUpdate({ _id: courseId }, { $set: { isApproved: false } })
            }
            else {
                await Course.findByIdAndUpdate({ _id: courseId }, { $set: { isApproved: true } })
            }
            res.status(200).json({ message: "Successfully Changed Approval Status" })
        }
    } catch (error) {
        res.status(500).jsn({ message: "Internal server Error" })
    }

}


export const fetchEnrollments = async (req, res) => {

    try {
        const today = new Date();
        console.log(today,"this is today");
        const fiveDaysAgo = new Date(today);
        fiveDaysAgo.setDate(today.getDate() - 4);

        const enrollments = await EnrolledCourses.aggregate([
            {
                $match: {
                    enrolledAt: { $gte: fiveDaysAgo, $lte: today },
                },
            },
            {
                $group: {
                    _id: {
                        year: { $year: "$date" },
                        month: { $month: "$date" },
                        day: { $dayOfMonth: "$date" },
                    },
                    count: { $sum: 1 },
                },
            },
            {
                $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 },
            },
        ]);
        console.log(enrollments,"this are enrollments");
        const dailyenrollmentCounts = enrollments.map((entry) => entry.count);
        console.log(dailyenrollmentCounts, "enrollment Count")
        const studentCount = await Student.find().countDocuments();
        const instructorCount = await Instructor.find().countDocuments();
        const courseCount = await Course.find().countDocuments();

        const enrollmentss = await EnrolledCourses.aggregate([
            {
                $group: {
                    _id: {
                        year: { $year: "$date" },
                        month: { $month: "$date" },
                        day: { $dayOfMonth: "$date" },
                    },
                    count: { $sum: 1 },
                },
            },
            {
                $group: {
                    _id: null,
                    totalEnrollments: { $sum: "$count" },
                    totalDays: { $sum: 1 },
                },
            },
            {
                $project: {
                    _id: 0,
                    averageEnrollmentsPerDay: { $divide: ["$totalEnrollments", "$totalDays"] },
                },
            },
        ]);
        const averageEnrollmentsPerDay = enrollmentss[0].averageEnrollmentsPerDay.toFixed(1);
        console.log(averageEnrollmentsPerDay,"avaerage");
        res
            .status(200)
            .json({ averageEnrollmentsPerDay, studentCount, instructorCount, courseCount, dailyenrollmentCounts });
    } catch (error) {
        console.log(error.message);
    }


}


