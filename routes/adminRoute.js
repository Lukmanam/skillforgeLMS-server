import express from 'express'
import { adminLogin } from '../controllers/adminController.js';
import { studentsList,studentBlock } from '../controllers/adminController.js';
import { instructorList } from '../controllers/adminController.js';
import { instructorBlock } from '../controllers/adminController.js';
import { fetchCounts } from '../controllers/adminController.js';
import { categoryList } from '../controllers/adminController.js';
import { addCategory } from '../controllers/adminController.js';
import { listunlist } from '../controllers/adminController.js';
import { coursesList } from '../controllers/adminController.js';
import {courseApproval} from  '../controllers/adminController.js';
import { fetchEnrollments } from '../controllers/adminController.js';
import adminAuthMiddleware from '../middlewares/adminAuthMiddleware.js';


const adminRoute=express.Router()

adminRoute.post("/login",adminLogin);
adminRoute.get("/students",studentsList)
adminRoute.patch("/studentBlock",studentBlock)
adminRoute.get("/instructors",instructorList)
adminRoute.patch("/instructorBlock",instructorBlock)
adminRoute.get("/fetchCounts",fetchCounts)

adminRoute.post('/addCategory',addCategory)
adminRoute.get("/categories", categoryList)
adminRoute.post('/listUnlist',listunlist)
adminRoute.get('/courses',coursesList)
adminRoute.post('/courseApproval',courseApproval)
adminRoute.get('/fetchEnrollments',fetchEnrollments)



export default adminRoute;