import express from "express";
import userRouter from '../src/routes/userRouter.js'
import authRouter from '../src/routes/authRouter.js'
import connectionDB from '../src/conexion.js'
import appointmentRouter from '../src/routes/appointmentRouter.js'
import mailRouter from '../src/routes/mailRouter.js'
import cors from 'cors';
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
dotenv.config();

const PORT = process.env.PORT || 8080;

const app = express();


const allowedOrigins = process.env.FRONTEND_URLS.split(",");


app.use(express.json());
app.use(express.urlencoded({ extended:true }))
app.use(cors({ 
    origin: function(origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true
 }));
 
 app.use(cookieParser());

connectionDB();

app.use('/api/user' , userRouter);
app.use('/api/auth', authRouter)
app.use('/api/appointment', appointmentRouter);
app.use("/api/mail", mailRouter);

app.listen(PORT, () => console.log(`servidor levantado ene el puerto ${PORT}`));


export default app;