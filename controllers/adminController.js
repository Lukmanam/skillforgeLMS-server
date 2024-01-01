import Jwt from "jsonwebtoken";
import dotenv from "dotenv";
import Student from "../models/studentModel.js";
import Instructor from "../models/instructorModel.js"
dotenv.config();

export const adminLogin = async (req, res) => {
    const adminemail = process.env.Admin_USERNAME;
    const adminpassword = process.env.Admin_PASSWORD;
    const userName = "Admin"
    try {
        const { email, password } = req.body;
        if (adminemail === email && adminpassword === password) {
            console.log("admin Login aakkaam");
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
            console.log("yeaah tokeeeen", token);
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
        console.log(students);
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
        console.log(instructors);
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
export const instructorCount = async (req, res) => {
    try {
        const count =await Instructor.find().countDocuments();
        console.log("Instructor Count",count);
        return count
    } catch (error) {
        console.log(error);
    }
}

export const studentsCount = async (req, res) => {
    try {
        const count = await Student.find().countDocuments()
        console.log("Students Count",count);
        return count
    } catch (error) {
        res.status(500).json({message:"Internal Server Error"})
    }
}


