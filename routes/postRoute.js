const express = require("express");
const router = express.Router();
const con = require("../db/dbConnnection");
const middleware = require("../middlewear/auth");
const jwt = require("jsonwebtoken");

// Get all posts
router.get("/", (req, res) => {
  try {
    con.query("SELECT * FROM posts", (err, result) => {
      if (err) throw err;
      res.send(result);
      console.log(result);
    });
  } catch (error) {
    console.log(error);
  }
});

// Gets one post
router.get("/:id", (req, res) => {
  try {
    con.query(
      `Select * from posts where post_id=${req.params.id}`,
      (err, result) => {
        if (err) throw err;
        res.send(result);
      }
    );
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
});
// Add post
router.post("/", (req, res) => {
  console.log("added new post successfully");
  const { user_id, image_title, caption, image, category } = req.body;
  try {
    con.query(
      `INSERT into posts (user_id,image_title,caption,image,category) values ( '${user_id}' ,'${image_title}', '${caption}' , '${image}','${category}')`,
      (err, result) => {
        if (err) throw err;
        res.send(result);
      }
    );
  } catch (error) {
    console.log(error);
  }
});
// edit post
router.put("/:id", (req, res) => {
  console.log(req.body.category);
  const { user_id, image_title, caption, image, category } = req.body;
  try {
    con.query(
      `UPDATE posts SET user_id="${user_id}",image_title="${image_title}",caption="${caption}",image="${image}",category="${category}" WHERE post_id="${req.params.id}"`,
      (err, result) => {
        if (err) throw err;
        res.send(result);
      }
    );
  } catch (error) {
    console.log(error);
  }
  console.log("updated post successfully");
});
// delete posts
router.delete("/:id", (req, res) => {
  console.log("deleted post successfully");
  try {
    con.query(
      `DELETE FROM posts  WHERE post_id="${req.params.id}"`,
      (err, result) => {
        if (err) throw err;
        res.send(result);
      }
    );
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
