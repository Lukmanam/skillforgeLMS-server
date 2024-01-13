import {studentSignup,emailOtpVerification,resendStudentOtp, studentLogin,allCourses,forgotpassword,changePassword,googleSignin} from '../controllers/studentController.js';
import { allCategories } from '../controllers/studentController.js';
import {checkfavouriteStatus} from '../controllers/studentController.js';

import {addtoFavCourses} from '../controllers/studentController.js';
import { fetchFavouriteCourses } from '../controllers/studentController.js';
import  {fetchCourseData} from '../controllers/studentController.js'
import { enrollToCourse } from '../controllers/studentController.js';
import { checkEnrollment} from '../controllers/studentController.js';
import { fetchEnrolledCourse } from '../controllers/studentController.js';

import express from 'express'

const studentRoute=express();
studentRoute.post('/signup',studentSignup);
studentRoute.post('/otp',emailOtpVerification);
studentRoute.post('/resendotp',resendStudentOtp)
studentRoute.post('/login',studentLogin)
studentRoute.post('/studentforgetpassword',forgotpassword)
studentRoute.post('/studentChangePassword',changePassword)
studentRoute.post('/googleSignin',googleSignin)
studentRoute.get('/allCategories',allCategories)
studentRoute.get('/fetchAllCourses',allCourses)
studentRoute.post('/addtoFavourite',addtoFavCourses)
studentRoute.post('/checkFavouriteStatus',checkfavouriteStatus)
studentRoute.get('/fetchFavouriteCourses/:studentId',fetchFavouriteCourses)
studentRoute.get('/fetchCourseData/:courseId',fetchCourseData)
studentRoute.post('/enrolltoCourse',enrollToCourse);
studentRoute.post('/checkEnrollment',checkEnrollment)
studentRoute.get('/EnrolledCourse/:studentId',fetchEnrolledCourse)




export default studentRoute;
