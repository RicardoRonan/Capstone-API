const express = require("express");
const router = express.Router();
const con = require("../db/dbConnnection");
const middleware = require("../middlewear/auth");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
// get all
router.get("/", (req, res) => {
  try {
    con.query("SELECT * FROM users", (err, result) => {
      if (err) throw err;
      res.json(result);
    });
  } catch (error) {
    console.log(error);
  }
});

// Gets one user
router.get("/:id", middleware, (req, res) => {
  try {
    con.query(
      `SELECT * FROM users where user_id =${req.params.id} `,
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

// edit user
router.put("/:id", (req, res) => {
  const { user_id, user_name, img, bio, email, password, user_type } = req.body;
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(password, salt);
  try {
    con.query(
      `UPDATE users SET user_id="${user_id}",password="${hash}",user_name="${user_name}",img="${img}",bio="${bio}",email="${email}",user_type="${user_type}" WHERE users.user_id="${req.params.id}"`,
      (err, result) => {
        if (err) throw err;
        res.send(result);
      }
    );
  } catch (error) {
    console.log(error);
  }
});
// delete user
router.delete("/:id", (req, res) => {
  try {
    con.query(
      `DELETE FROM users  WHERE users.user_id="${req.params.id}"`,
      (err, result) => {
        if (err) throw err;
        res.send(result);
      }
    );
  } catch (error) {
    console.log(error);
  }
});

// router.get;

// Register Route and Add new user
// The Route where Encryption starts
router.post("/register", (req, res) => {
  try {
    let sql = "INSERT INTO users SET ?";
    const { user_name, img, bio, email, password, user_type } = req.body;

    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);

    let user = {
      user_name,
      img,
      bio,
      email,
      password: hash,
      user_type,
    };

    con.query(sql, user, (err, result) => {
      if (err) throw err;
      console.log(result);
      res.send(`User ${(user.full_name, user.email)} created successfully`);
    });
  } catch (error) {
    console.log(error);
  }
});

// Login
router.post("/login", (req, res) => {
  try {
    let sql = "SELECT * FROM users WHERE ?";

    let user = {
      email: req.body.email,
    };

    con.query(sql, user, async (err, result) => {
      if (err) throw err;
      if (result.length === 0) {
        res.status(400).json({
          status: "error",
          error: "Email not found",
        });
      } else {
        const isMatch = await bcrypt.compare(
          req.body.password,
          result[0].password
        );

        if (!isMatch) {
          res.send("Password incorrect");
        } else {
          const payload = {
            user: {
              user_id: result[0].user_id,
              email: result[0].email,
              user_name: result[0].user_name,
              img: result[0].img,
              bio: result[0].bio,
              user_type: result[0].user_type,
            },
          };

          jwt.sign(
            payload,
            process.env.jwtSecret,
            {
              expiresIn: "365d",
            },
            (err, token) => {
              if (err) throw err;
              res.json({ token });
            }
          );
        }
      }
    });
  } catch (error) {
    console.log(error);
  }
}),
  // Verify
  router.get("/users/verify", (req, res) => {
    const token = req.header("x-auth-token");
    jwt.verify(token, process.env.jwtSecret, (error, decodedToken) => {
      if (error) {
        res.status(401).json({
          msg: "Unauthorized Access!",
        });
      } else {
        res.status(200);
        res.send(decodedToken);
      }
    });
  });
// router.get("/singleuser/:id", (req, res) => {
//   try {
//     con.query(
//       `SELECT user_id FROM users INNER JOIN posts ON users.user_id = posts.user_id WHERE users.user_id`,
//       (err, result) => {
//         if (err) throw err;
//         res.send(result);
//       }
//     );
//   } catch (error) {
//     console.log(error);
//     res.status(400).send(error);
//   }
// })
module.exports = router;
