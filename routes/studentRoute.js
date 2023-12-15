import studentSignup from '../controllers/studentController.js';
import express from 'express'


const studentRoute=express();
studentRoute.post('/signup',studentSignup)


export default studentRoute;