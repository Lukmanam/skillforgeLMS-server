import express from 'express'
import dbconnect from './config/database.js';
import dotenv from "dotenv";
import cors from 'cors'
import studentRoute from './routes/studentRoute.js';
import instructorRoute from './routes/instructorRoute.js';
dotenv.config();
const app=express()
const PORT=process.env.PORT ||3000;

dbconnect();
app.use(express.urlencoded({extended:true}))
app.use(express.json())
const corsoptions={
    origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'PATCH'],
  credentials: true,
}

app.use(cors(corsoptions))
app.use('/instructor',instructorRoute)
app.use('/',studentRoute);



app.listen(PORT,()=>{
    console.log(`Server started at ${PORT}`);
})



