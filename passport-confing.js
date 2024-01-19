import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import session from 'express-session';
import {prisma} from './Config/prismaConfig.js'


passport.use(
  new GoogleStrategy(
    {
      clientID: '923593978068-5spdgkfqr883a38d3sp5do7qh2mqltf1.apps.googleusercontent.com',
      clientSecret: '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',
      callbackURL: "https://second-server-blog.vercel.app/api/auth/google/callback",
      scope: ['profile', 'email'],
    },
    async (accessToken, refreshToken, profile, done) => {

      try {
        // Checking if the user already exists  database
        const existingUser = await prisma.user.findUnique({
          where: { username: profile.displayName },
        });

        if (existingUser) {
          // If the user exists, return the user data
          return done(null, existingUser);
        } else {
          // If the user doesn't exist, create a new user in your database
          const newUser = await prisma.user.create({
            data: {
              username: profile.displayName,
              email: profile.emails[0]?.value,
              profilePic: profile.photos[0]?.value || '',
              password:''
            },
          });

          // Return the newly created user data
          return done(null, newUser);
        }
      } catch (error) {
        console.error('Error in Google strategy callback:', error);
        return done(error, null);
      }
    }
  )
);


passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});



export default passport;

