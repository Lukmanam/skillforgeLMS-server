import express from 'express'
import { adminLogin } from '../controllers/adminController.js';
import { studentsList,studentBlock } from '../controllers/adminController.js';
import { instructorList } from '../controllers/adminController.js';
import { instructorBlock } from '../controllers/adminController.js';
import { instructorCount,studentsCount } from '../controllers/adminController.js';



const adminRoute=express.Router()

adminRoute.post("/login",adminLogin);
adminRoute.get("/students",studentsList)
adminRoute.patch("/studentBlock",studentBlock)
adminRoute.get("/instructors",instructorList)
adminRoute.patch("/instructorBlock",instructorBlock)
adminRoute.get("/instructorCount",instructorCount)
adminRoute.get("/studentsCount",studentsCount)



export default adminRoute;