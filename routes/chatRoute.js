import express from 'express'
const chatRoute = express();
import { studentChats } from '../controllers/chatController.js';
import { studentData } from '../controllers/chatController.js';
import { instructorData } from '../controllers/chatController.js';

chatRoute.get("/chat/:id", studentChats);
chatRoute.get('/studentData/:id', studentData);
chatRoute.get('/instructorData/:id', instructorData);


export default chatRoute
