import Jwt from "jsonwebtoken";
import dotenv from "dotenv";
import Student from "../models/studentModel.js";
import Instructor from "../models/instructorModel.js"
import Category from "../models/categoryModel.js"
import Course from  "../models/courseModel.js"
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
        const count = await Instructor.find().countDocuments();
        console.log("Instructor Count", count);
        return count
    } catch (error) {
        console.log(error);
    }
}

export const studentsCount = async (req, res) => {
    try {
        const count = await Student.find().countDocuments()
        console.log("Students Count", count);
        return count
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" })
    }
}
export const addCategory = async (req, res) => {
    try {

        const{ categoryName} = req.body;
        console.log(categoryName);
        const alreadyExist = await Category.findOne({ name: categoryName });
       console.log(alreadyExist);
        if (alreadyExist) {
            console.log("already exist");
            res.status(400).json({message:"Category already exist"})
        }
        else {
            console.log("trying to save");
            const category = new Category({
                name: categoryName
            })
            const saveCategory = await category.save();
            res.status(200).json({message:"Category Added"})
        }
    } catch (error) {
console.log(error);
    }
}

export const categoryList = async (req, res) => {
    try {
        const category = await Category.find()
        console.log(category);
        res
            .status(200).json({ category })
    } catch (error) {
        console.log(error);

    }
}

export const listunlist=async(req,res)=>{
    try {
        console.log(req.body);
        const {categoryId}=req.body;
        console.log(categoryId);
        const status=await Category.findOne({_id:categoryId})
        if(status.isBlocked===true)
        {
           const updated= await Category.findByIdAndUpdate({_id:categoryId},{$set:{isBlocked:false}})
            res.status(200).json({message:"Listed Successfully",updated})
        }
        else{
           const updated= await Category.findByIdAndUpdate({_id:categoryId},{$set:{isBlocked:true}})
            res.status(200).json({message:"Unlisted Successfully",updated})
        }
        
    } catch (error) {
        console.log(error);
        res.status(500).json({message:"Internal Server Error"})
    }


}

export const coursesList=async(req,res)=>{
    try {
        const courses= await Course.find().populate('category');
        console.log(courses);
        res.status(200).json({courses})
        
    } catch (error) {
        console.log(error);
        res.status(500).json({message:"Internal server Error"})
        
    }
}


export const courseApproval=async(req,res)=>{
    try {
        
        const {courseId}=req.body;
        console.log(courseId);
        const courseData=await Course.findOne({_id:courseId});
        console.log(courseData);
        if(courseData){
        if(courseData.isApproved){
            console.log("removing Approval");
           const updated= await Course.findByIdAndUpdate({_id:courseId},{$set:{isApproved:false}})
            console.log(updated,"this is updated update has been removed");
        }
        else
        {
            await Course.findByIdAndUpdate({_id:courseId},{$set:{isApproved:true}})
        }
        res.status(200).json({message:"Successfully Changed Approval Status"})
    }
    } catch (error) {
     res.status(500).jsn({message:"Internal server Error"}) 
    }

}


