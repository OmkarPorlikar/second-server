
// // In login My main moto  is to get the data from frontend and perform the acion with it like finding if the 
// // user exsist or not .Hence i am not using the saving method to save data or passing a new object to the model schema
// //In the login route, you are not using the save method because you are not modifying or creating a new document in
// // the database. Instead, you are querying the database to find a user based on the provided username, and then you are performing a password check.


// Assuming TypeScript for this example
import express from 'express';
import bcrypt from 'bcryptjs';
import {prisma} from '../Config/prismaConfig.js'
import { Strategy as LocalStrategy } from 'passport-local';
// import passport from './passport-config.js';
const router = express.Router();
import passport from '../passport-confing.js'
import cors from 'cors'
import pkg from 'jsonwebtoken'
const {sign} =pkg;


// Register Api
router.post('/register', async (req, res) => {
    console.log("inside the register")
  try {
    // Check if user with the same username already exists
    const existingUser = await prisma.user.findUnique({
      where: { username: req.body.username },
    });

    if (existingUser) {
      // If user already exists, return a 400 status with an error message
      console.error('User already exists');
      return res.status(400).json({error:"User alredy Exist"});
    }

    // If user does not exist, proceed with registration
    const salt = await bcrypt.genSalt(10);
    const hashpass = await bcrypt.hash(req.body.password, salt);

    const user = await prisma.user.create({
      data: {
        username: req.body.username,
        email: req.body.email,
        password: hashpass,
        profilePic:""
      },
    });

    res.status(201).json(user);
  } catch (err) {
    // Handle any other potential errors
    console.error(err);
    res.status(500).json({ error: 'Please Provide all data' });
  }
});



// Login User
router.post ('/loginUser' ,async (req, res) => {
  console.log("indie  the login")
  try {
    const userData = await prisma.user.findUnique({
      where: { username: req.body.username },
    });

    if (!userData) {
      return res.status(400).json('Wrong UserName');
    }

    const userPass = await bcrypt.compare(req.body.password, userData.password);

    if (!userPass) {
      return res.status(400).json('Wrong Password');
    }
    const { password, ...tokenObject } = userData;
    const token = sign(tokenObject, process.env.SECRET, { expiresIn: '3h' });
    // Exclude password from the response
    // console.log(tokenObject,"other user")

    return res.status(200).json({token , tokenObject});
  } catch (err) {
    console.error('Login failed', err);
    return res.status(500).json({ error: err.message });
  }
})

// Handle logout
router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});


// Actual route for Google authentication

router.get('/auth/google', cors(), (req, res, next) => {
  console.log('Inside the Google auth route');
  passport.authenticate('google', { scope: ['profile', 'email'] })(req, res, next);
});

// Handling Google authentication callback


router.get(
  '/auth/google/callback',
  passport.authenticate('google', {
    failureRedirect: 'https://wander-world-blog.vercel.app/',
  }),
  (req, res) => {
    // Extract relevant user data
    console.log(req.user , "bap re")
    const { username, email, profilePic ,id} = req.user;

    // Create sanitized user object
    const tokenObject = {
      id,
      username,
      email,
      profilePic,
      auth:"google Auth"
    };
    const token = sign(tokenObject, process.env.SECRET, { expiresIn: '3h' });

    // Redirect to home page with sanitized user data in query parameters
    const userData = JSON.stringify({token , tokenObject});
    console.log(userData, "bapu user")
    res.redirect(`https://wander-world-blog.vercel.app/?user=${encodeURIComponent(userData)}`);
  }
);



export default router;
