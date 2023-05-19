const express = require("express");
const router = express.Router();
const User = require("../models/User");
//const User = require("../Config/Connect");
const multer = require("multer");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const bcryptjs = require("bcryptjs");

filename = "";
const mystorage = multer.diskStorage({
  destination: "./uploads",
  filename: (req, file, redirect) => {
    let date = Date.now();
    let f1 = date + "." + file.mimetype.split("/")[1];
    redirect(null, f1);
    filename = f1;
  },
});
const upload = multer({ storage: mystorage });

router.post("/signup", upload.any("image"), async (req, res) => {
  data = req.body;
  usr = new User(data);
  usr.image = filename;
  usr
    .save()
    .then((savedUser) => {
      res.status(200).send(savedUser);
    })
    .catch((err) => {
      res.status(400).send(err);
    });
  filename = "";
});

router.get("/don", (req, res) => {
  const token = req.headers.authorization.split(" ")[1];
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decodedToken) => {
    if (err) {
      res.status(401).send("Token invalide");
    } else {
      const userId = decodedToken.userId;
      User.findById(userId, (err, result) => {
        if (err || result === null) {
          res.status(404).send("Utilisateur introuvable");
        } else {
          const userToSend = {
            id: result._id,
            email: result.email,
            password: result.password,
          };
          res.status(200).send(JSON.stringify(userToSend));
        }
      });
    }
  });
});

router.post("/login", (req, res) => {
  const query = {
    email: req.body.email,
    password: req.body.password,
  };
  User.findOne(query, (err, result) => {
    if (result != null) {
      const objToSend = {
        email: result.email,
        password: result.password,
      };

      // set user ID in session

      res.status(200).send(JSON.stringify(objToSend));
    } else {
      res.status(404).send("wrong password");
    }
  });
});

/*
router.post("/login", (req, res) => {
  const query = {
    email: req.body.email,
    password: req.body.password,
  };
  User.findOne(query, (err, result) => {
    if (result != null) {
      // Create an authentication token
      const accessToken = jwt.sign(
        { userId: result._id },
        process.env.ACCESS_TOKEN_SECRET
      );

      // Save the authentication token in a cookie
      res.cookie("accessToken", accessToken, { httpOnly: true });

      // Send the user information to the frontend
      const userToSend = {
        id: result._id,
        email: result.email,
        password: result.password,
      };
      res.status(200).send(JSON.stringify(userToSend));
    } else {
      res.status(401).send("E-mail ou mot de passe incorrect.");
    }
  });
});
*/
router.get("/getallusers", (req, res) => {
  User.find()
    .then((users) => {
      res.status(200).send(users);
    })
    .catch((err) => {
      res.status(400).send(err);
    });
});

router.get("/getuser/:id", (req, res) => {
  myid = req.params.id;
  User.findOne({ _id: myid })
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((err) => {
      res.status(400).send(err);
    });
});

router.delete("/deleteuser/:id", (req, res) => {
  id = req.params.id;
  User.findOneAndDelete({ _id: id })
    .then((deleteuser) => {
      res.status(200).send(deleteuser);
    })
    .catch((err) => {
      res.status(400).send(err);
    });
});

router.put("/updateuser/:id", (req, res) => {
  id = req.params.id;
  data = req.body;
  User.findByIdAndUpdate({ _id: id }, data)
    .then((updated) => {
      res.status(200).send(updated);
    })
    .catch((err) => {
      res.status(400).send(err);
    });
});
const nodemailerFrom = "contactvidoc@gmail.com";

const transport = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // true pour TLS
  auth: {
    user: "adem.wertani@esprit.tn",
    pass: "bzkykucyfyfcgjcr",
  },
});

router.post("/sendPasswordRecoveryEmail", async function (request, result) {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

  const email = request.body.email;

  if (!email) {
    result.json({
      status: "error",
      message: "Please enter your e-mail address.",
    });

    return;
  }

  // update JWT of user in database
  const user = await User.findOne({
    email: email,
  });

  if (user == null) {
    result.json({
      status: "error",
      message: "Email does not exists.",
    });

    return;
  }

  const minimum = 0;
  const maximum = 999999;
  const randomNumber =
    Math.floor(Math.random() * (maximum - minimum + 1)) + minimum;

  await User.findOneAndUpdate(
    {
      _id: user._id,
    },
    {
      $set: {
        code: randomNumber,
      },
    }
  );

  const emailHtml =
    "Your password reset code is: <b style='font-size: 30px;'>" +
    randomNumber +
    "</b>.";
  const emailPlain = "Your password reset code is: " + randomNumber + ".";

  let mailOptions = {
    from: nodemailerFrom,
    to: email,
    subject: "Password reset code",
    text: emailPlain,
    html: emailHtml,
  };

  transport.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log(info);
    }
  });

  result.json({
    status: "success",
    message: "A verification code has been sent on your email address.",
  });
});

router.post("/resetPassword", async function (req, result) {
  //const email = request.fields.email
  const code = req.body.code;
  const password = req.body.password;
  //const conf = request.fields.conf

  if (!code || !password) {
    result.json({
      status: "error",
      message: "Please fill all fields.",
    });
    console.log("Please fill all fields.");
    return;
  }

  // update JWT of user in database
  /*const user = User.findOne({
    $and: [
      {
        code: code,
      },
      {
        code: parseInt(code),
      },
    ],
  });*/
  const user = await User.findOne({
    code: code,
  });
  console.log(user);

  if (user == null) {
    result.json({
      status: "error",
      message: "Invalid email code.",
    });
    console.log("Invalid email code.");
    return;
  }

  const salt = bcryptjs.genSaltSync(10);
  const hash = await bcryptjs.hashSync(password, salt);

  await User.findOneAndUpdate(
    {
      _id: user._id,
    },
    {
      $set: {
        password: password,
      },

      $unset: {
        code: "",
      },
    }
  );

  result.json({
    status: "success",
    message: "Password has been changed.",
  });
});

module.exports = router;
