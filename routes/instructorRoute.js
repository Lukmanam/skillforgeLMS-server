
import express from 'express'
import {registerInstructor} from '../controllers/instructorsController.js';

const instructorRoute = express.Router()
instructorRoute.post('/signup', registerInstructor)


 
export default instructorRoute;


