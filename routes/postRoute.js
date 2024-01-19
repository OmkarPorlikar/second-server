

import express from 'express';
import {prisma} from '../Config/prismaConfig.js'
import authenticateToken from '../middleware/authenticateToken.js';
const postRoute = express.Router();

// Create Endpoint
postRoute.post("/", authenticateToken,  async (req, res) => {
  try {
    const newPost = await prisma.post.create({
      data: {
        title: req.body.title,
        desc: req.body.desc,
        photo: req.body.photo,
        username: req.body.username,
        categories: req.body.categories,
      },
    });
    res.status(200).json(newPost);
  } catch (err) {
    console.log(err)
    res.status(500).json(err);
  }
});

// Update Endpoint

postRoute.put("/update/:id",  async (req, res) => {
  console.log("inside the update post")
  console.log(req.body.title, req.body.desc )
  try {
    const post = await prisma.post.findUnique({
      where: { id: req.params.id },
    });
 console.log(post?.username , "post username")
 console.log(req.body.username , "body userName")
    if (post && post.username === req.body.username) {
      try {
        const updatedPost = await prisma.post.update({
          where: { id: req.params.id },
          data: {
            title: req.body.title,
            desc: req.body.desc,
            photo:req.body.photo,
            categories:req.body.categories  
        },
        });
        console.log(updatedPost, "updated post")
        res.status(200).json(updatedPost);
      } catch (err) {
        console.log(err , "post error")
        res.status(500).json(err);
      }
    } else {
      res.status(401).json("You can update only your post!");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

// Delete Endpoint

postRoute.delete("/:id", authenticateToken,  async (req, res) => {
  console.log("Inside delete")
  try {
    const post = await prisma.post.findUnique({
      where: { id: req.params.id },
    });

    if (post && post.username === req.body.username) {
      try {
        const deletedPost = await prisma.post.delete({
          where: { id: req.params.id },
        });
        res.status(200).json(deletedPost);
      } catch (err) {
        res.status(500).json("something went wrong 1");
      }
    } else {
      res.status(401).json("You can delete only your post!");
    }
  } catch (err) {
    res.status(500).json('something went wrong 2');
  }
});


postRoute.get("/:id", async (req, res) => {
  try {
    const post = await prisma.post.findUnique({
      where: { id: req.params.id },
    });
    res.status(200).json(post);
  } catch (err) {
    res.status(500).json(err);
  }
});

postRoute.get("/", async (req, res) => {
  const username = req.query.username;
  console.log(username , "get post")
  const catName = req.query.cat;
  try {
    let posts;
    if (username) {
      posts = await prisma.post.findMany({
        where: { username },
      });
    } else if (catName) {
      posts = await prisma.post.findMany({
        where: {
          categories: {
            has: catName,
          },
        },
      });
    } else {
      posts = await prisma.post.findMany();
    }
    res.status(200).json(posts);
  } catch (err) {
    console.log(  "error while getting post",err )
    res.status(500).json(err);
  }
});

export default postRoute;




