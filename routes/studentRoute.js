import { studentSignup, emailOtpVerification, resendStudentOtp, studentLogin, allCourses, forgotpassword, changePassword, googleSignin } from '../controllers/studentController.js';
import { allCategories } from '../controllers/studentController.js';
import { checkfavouriteStatus } from '../controllers/studentController.js';
import { addtoFavCourses } from '../controllers/studentController.js';
import { fetchFavouriteCourses } from '../controllers/studentController.js';
import { fetchCourseData } from '../controllers/studentController.js'
import { enrollToCourse } from '../controllers/studentController.js';
import { checkEnrollment } from '../controllers/studentController.js';
import { fetchEnrolledCourse } from '../controllers/studentController.js';
import { editStudentProfile } from '../controllers/studentController.js';
import { allCourseslist } from '../controllers/studentController.js';
import { allCategoryCoursePage } from '../controllers/studentController.js';
import { paymentCheckout } from '../controllers/courseController.js';
import { learnCourse } from '../controllers/studentController.js';
import { saveProgress } from '../controllers/courseController.js';
import { alreadyCompletedModules } from '../controllers/courseController.js';
import { rateCourse } from '../controllers/studentController.js';
import { checkratingStatus } from '../controllers/studentController.js';
import { fetchCourseRating } from '../controllers/studentController.js';
import { createChat } from '../controllers/studentController.js';
import { getInstructor } from '../controllers/studentController.js';
import { fetchcoursereviews } from '../controllers/studentController.js';
import { searchCourse } from '../controllers/studentController.js';
import { categoryFilter } from '../controllers/studentController.js';
import studentAuthMidleware from '../middlewares/studentAuthMidleware.js';
import express from 'express'


//Studen Route
const studentRoute = express();
studentRoute.post('/signup', studentSignup);
studentRoute.post('/otp', emailOtpVerification);
studentRoute.post('/resendotp', resendStudentOtp)
studentRoute.post('/login', studentLogin)
studentRoute.post('/studentforgetpassword', forgotpassword)
studentRoute.post('/studentChangePassword', changePassword)
studentRoute.post('/googleSignin', googleSignin)
studentRoute.get('/allCategories', allCategories)
studentRoute.get('/fetchAllCourses', allCourses)
studentRoute.get('/allCourselist', allCourseslist)
studentRoute.get('/allCategoriesList', allCategoryCoursePage)
studentRoute.post('/addtoFavourite', addtoFavCourses)
studentRoute.post('/checkFavouriteStatus', checkfavouriteStatus)
studentRoute.get('/fetchFavouriteCourses/:studentId',studentAuthMidleware, fetchFavouriteCourses)
studentRoute.get('/fetchCourseData/:courseId',studentAuthMidleware, fetchCourseData)
studentRoute.post('/enrolltoCourse', enrollToCourse);
studentRoute.post('/checkEnrollment', checkEnrollment)
studentRoute.get('/EnrolledCourse/:studentId',studentAuthMidleware, fetchEnrolledCourse)
studentRoute.post('/editStudentProfile', editStudentProfile)
studentRoute.post('/paymentCheckoutSesion', paymentCheckout);
studentRoute.get('/getinstructor/:courseId', getInstructor)
studentRoute.get('/learnCourse/:courseId',studentAuthMidleware, learnCourse);
studentRoute.post('/saveCourseProgress', saveProgress)
studentRoute.get('/alreadyCompletedModules', alreadyCompletedModules)
studentRoute.post('/rateCourse', rateCourse)
studentRoute.get('/checkratingStatus', checkratingStatus)
studentRoute.get('/fetchCourseRating/:courseId', fetchCourseRating)
studentRoute.get('/fetchcoursereviews/:courseId', fetchcoursereviews)
studentRoute.post('/createChat', createChat)
studentRoute.get('/search/:searchQuery',searchCourse)
studentRoute.get('/categoryFilter/:filterCategory',categoryFilter)



export default studentRoute;
