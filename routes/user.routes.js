const express = require("express");
const { authmiddleware } = require("../middlewares/auth.middleware");
const userModel = require("../models/user.model");
const userRouter = express.Router();
var jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const myPlaintextPassword = "s0//P4$$w0rD";
const someOtherPlaintextPassword = "not_bacon";
const nodemailer = require("nodemailer");
require("dotenv").config();

userRouter.post("/auth/signup", authmiddleware, async (req, res) => {
  try {
    const { username, email, password, role } = req.body;
    bcrypt.hash(password, saltRounds, async function (err, hash) {
      if (err) {
        console.log(err);
      } else {
        let user = await userModel.create({
          username,
          email,
          password: hash,
          role,
        });
        res.status(201).json({
          message: "Sign up sucessful",
          user,
        });
      }
    });
  } catch (err) {
    res.status(500).json({
      message: "something went wrong",
      err: err.message,
    });
  }
});
userRouter.post("/auth/login", authmiddleware, async (req, res) => {
  const { email, password } = req.body;
  try {
    let user = await userModel.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "User Not Found",
      });
    }
    let hash = user.password
    bcrypt.compare(password, hash, function (err, result) {
      if (result == true) {
        var token = jwt.sign(
          { id: user._id, role: user.role, email },
          process.env.JWT_KEY
        );
        res.status(201).json({
          message: "Login sucessful",
          accesstoken: token,
        });
      }else{
        return res.status(401).json({
          message: "wrong password",
        });
      }
    });

  } catch (err) {
    res.status(500).json({
      message: "something went wrong",
      err: err.message,
    });
  }
});
userRouter.post("/auth/forgot-password", async (req, res) => {
  const { email } = req.body;

  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).json({
        message: "User Not found",
      });
    }
    const resetToken = jwt.sign({ email }, process.env.JWT_KEY);

    const transporter = nodemailer.createTransport({
      service: "gmail",
      port: 587,
      secure: false,
      auth: {
        user: process.env.USER_EMAIL,
        pass: process.env.APP_PASS,
      },
    });

    const info = await transporter.sendMail({
      from: process.env.USER_EMAIL,
      to: email,
      subject: "Reset Password",
      html: `<b> click this link to reset your password <a href='http://localhost:3000/api/v1/auth/reset-password/${resetToken}'> click</a></b>`,
    });

    console.log("Message sent:", info.messageId);
    res.status(200).json({
      message: "send password reset request",
    });
  } catch (err) {
    res.status(500).json({
      message: "something went wrong",
      err: err.message,
    });
  }
});
userRouter.patch("/auth/reset-password/:token", async (req, res) => {
  const { token } = req.params;
  const { newpassword } = req.body;
  try {
    var decoded = jwt.verify(token, process.env.JWT_KEY);
    const user = await userModel.findOne({ email: decoded.email });
    if (!user) {
      return res.status(404).json({
        message: "User Not found",
      });
    }

    const hashpassword = await bcrypt.hash(newpassword, 10);
    user.password = hashpassword;
    await user.save();
    res.status(200).json({
      message: "password reset sucessful",
    });
  } catch (err) {
    res.status(500).json({
      message: "something went wrong",
      err: err.message,
    });
  }
});

module.exports = userRouter;
