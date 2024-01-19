
// lib imports
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import multer from 'multer';
import path from 'path'
// Routes import 
import router from './routes/authRoute.js'
import useRouter from './routes/userRoute.js';
import postRoute from './routes/postRoute.js';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import session from 'express-session';
import googleStrategy from 'passport-google-oauth20' 
import passport from './passport-confing.js'
dotenv.config();
const app = express();
app.use(cors())
app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use("/images", express.static(path.join(__dirname, "/images")));


// Routes
app.use(session({ secret: 'omkar_porlikar', resave: false, saveUninitialized: true }));
app.use(passport.initialize())
app.use(passport.session());
app.use('/api' ,router);


app.use('/api/user',useRouter);
app.use('/api/post' ,postRoute)
passport.use(googleStrategy);



app.listen('9080', () => {
  console.log('The server has started');
});
