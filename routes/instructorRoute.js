
import express from 'express'
import {registerInstructor, resendInstructorOtp} from '../controllers/instructorsController.js';
import { emailOtpVerification } from '../controllers/studentController.js';
import { instructorEmailOtpVerification } from '../controllers/instructorsController.js';
import { InstructorLogin } from '../controllers/instructorsController.js';
import { instructorforgotpassword } from '../controllers/instructorsController.js';
import { changePassword } from '../controllers/instructorsController.js';
import { googleSignins } from '../controllers/instructorsController.js';

const instructorRoute = express.Router()
instructorRoute.post('/signup', registerInstructor)
instructorRoute.post('/resendotp',resendInstructorOtp)
instructorRoute.post('/insotp',instructorEmailOtpVerification);
instructorRoute.post('/login',InstructorLogin);
instructorRoute.post ('/instructorForgotPassword',instructorforgotpassword )
instructorRoute.post('/instructorChangePassword',changePassword)
instructorRoute.post('/googleSignins',googleSignins)




 
export default instructorRoute;


