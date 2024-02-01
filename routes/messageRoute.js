import express from 'express'
const messageRoute = express();
import { addMessage } from '../controllers/messageController.js';
import { getMessages } from '../controllers/messageController.js';
messageRoute.post('/addMsg', addMessage);
messageRoute.get('/getMsg/:id', getMessages);

export default messageRoute