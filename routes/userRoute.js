

// Assuming TypeScript for this example
import express from 'express';
import bcrypt from 'bcryptjs';
import {prisma} from '../Config/prismaConfig.js'
import authenticateToken from '../middleware/authenticateToken.js';
import  pkg  from 'jsonwebtoken';
const {sign} = pkg;

const userRouter = express.Router();

userRouter.put('/:id/update', authenticateToken, async (req, res) => {
  console.log(req.body.userId ,"The user Id is ")
console.log(  req.params.id , "params id"  )
  if (req.body.userId == req.params.id) {
    console.log(req.body.password);
    console.log(req.body.username, "username put");

    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      req.body.password = await bcrypt.hash(req.body.password, salt);
    }

    try {
      const tokenObject = await prisma.user.update({
        where: { id: req.params.id },
        data: {
          username: req.body.username,
          email:req.body.email,
          password: req.body.password,
          profilePic: req.body.photo,
        },
      });

      const token  = sign(tokenObject , process.env.SECRET , {expiresIn :'3h'})
      res.status(200).json({token , tokenObject});
    } catch (error) {
      console.error('Something went wrong', error);
      res.status(500).json({ error: error.message });
    }
  } else {
    console.log('You can only update your account');
    res.status(500).json({ error: error.message });
  }
});




userRouter.delete('/:id/delete', authenticateToken,  async (req, res) => {
  console.log(req.body.id , "body id delete")
  console.log(req.params.id , "params id delete")
  console.log(req.body.username , " username delete")
  if (req.body.id === req.params.id) {
    try {
      const user = await prisma.user.findUnique({
        where: { username: req.body.username },
      });
console.log("User" , user)
      try {
        await prisma.post.deleteMany({
          where:{ username: user.username }
        });
        const deletedUser = await prisma.user.delete({
          where: { id: req.params.id },
        });

         console.log("The user has been deleted")
         console.log(deletedUser,"user deleted")
        res.status(201).json(deletedUser);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    } catch (error) {
      console.error('User not found', error);
      res.status(500).json({ error: error.message });
    }
  } else {
    console.error('You can only delete your account');
    res.status(500).json("You can delete Only your Account");
  }
});

export default userRouter;


