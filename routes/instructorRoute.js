
import express from 'express'
import {registerInstructor, resendInstructorOtp} from '../controllers/instructorsController.js';
import { emailOtpVerification } from '../controllers/studentController.js';
import { instructorEmailOtpVerification } from '../controllers/instructorsController.js';
import { InstructorLogin } from '../controllers/instructorsController.js';
import { instructorforgotpassword } from '../controllers/instructorsController.js';
import { changePassword } from '../controllers/instructorsController.js';
import { googleSignins } from '../controllers/instructorsController.js';
import { addNewCourse, fetchCategories } from '../controllers/courseController.js';
import { myCourses } from '../controllers/instructorsController.js';
import {fetchCouseData} from '../controllers/instructorsController.js';
import {addModule} from '../controllers/courseController.js'
import {deleteModule} from '../controllers/courseController.js'
import {changeListStatus}  from '../controllers/instructorsController.js'
import {checkListStatus}  from '../controllers/instructorsController.js'
import {getCourseDetails} from '../controllers/courseController.js'
import { editCourse } from '../controllers/courseController.js';

const instructorRoute = express.Router()
instructorRoute.post('/signup', registerInstructor)
instructorRoute.post('/resendotp',resendInstructorOtp)
instructorRoute.post('/insotp',instructorEmailOtpVerification);
instructorRoute.post('/login',InstructorLogin);
instructorRoute.post ('/instructorForgotPassword',instructorforgotpassword )
instructorRoute.post('/instructorChangePassword',changePassword)
instructorRoute.post('/googleSignins',googleSignins)
instructorRoute.post('/addCourse',addNewCourse)
instructorRoute.get('/myCourses/:instructorId',myCourses)
instructorRoute.get('/fetchCategories',fetchCategories);
instructorRoute.get('/fetchCourseData/:courseId',fetchCouseData)
instructorRoute.post('/addModule',addModule)
instructorRoute.post('/deleteModule',deleteModule)
instructorRoute.post('/changeListStatus',changeListStatus)
instructorRoute.get('/checkListStatus/:courseId',checkListStatus)
instructorRoute.get('/getCourseDetails/:courseId',getCourseDetails)
instructorRoute.patch('/editCourse',editCourse)
 




export default instructorRoute;


