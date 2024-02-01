import express from 'express'
import dbconnect from './config/database.js';
import dotenv from "dotenv";
import cors from 'cors'
import studentRoute from './routes/studentRoute.js';
import instructorRoute from './routes/instructorRoute.js';
import adminRoute from './routes/adminRoute.js';
import chatRoute from './routes/chatRoute.js';
import messageRoute from './routes/messageRoute.js';
import socketConnection from './socketIo.js';
import http from 'http'
dotenv.config();

const app = express()
const PORT = process.env.PORT || 3000;
app.use(express.json({ limit: '50mb' })); // Adjust the limit as needed for JSON data
app.use(express.urlencoded({ limit: '50mb', extended: true })); // Adjust the limit as needed for URL-encoded data

dbconnect();
// app.use(express.urlencoded({extended:true}))
// app.use(express.json())
const corsoptions = {
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'PATCH'],
  credentials: true,
}

app.use(cors(corsoptions))
app.use('/admin', adminRoute)
app.use('/instructor', instructorRoute)
app.use('/', studentRoute);
app.use("/chat", chatRoute)
app.use('/message', messageRoute)

const server = http.createServer(app)
socketConnection(server)
server.listen(PORT, () => {
  console.log(`server running on port http://localhost:${PORT}`);
})

// app.listen(PORT,()=>{
//     console.log(`Server started at ${PORT}`);
// })



