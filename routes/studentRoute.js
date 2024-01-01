import {studentSignup,emailOtpVerification,resendStudentOtp, studentLogin,forgotpassword,changePassword,googleSignin} from '../controllers/studentController.js';
import express from 'express'


const studentRoute=express();
studentRoute.post('/signup',studentSignup);
studentRoute.post('/otp',emailOtpVerification);
studentRoute.post('/resendotp',resendStudentOtp)
studentRoute.post('/login',studentLogin)
studentRoute.post('/studentforgetpassword',forgotpassword)
studentRoute.post('/studentChangePassword',changePassword)
studentRoute.post('/googleSignin',googleSignin)





export default studentRoute;
