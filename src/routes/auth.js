const express = require("express");
const authRouter = express.Router();
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { isValidation } = require("../Util/Healper");

const isProduction = process.env.NODE_ENV === "production"; // add new 

authRouter.post("/signup", async (req, res) => {
  try {
    // check all type of validation for email,firstname etc...
    isValidation(req);
    // Extracts values sent by frontend.
    const { firstName, lastName, email, password } = req.body;
    // Extracts values sent by frontend.
    const hashPassword = await bcrypt.hash(password, 10);
    // create new user object
    const user = new User({
      firstName,
      lastName,
      email,
      password: hashPassword,
    });

    // save into to tha database
    const savedUser = await user.save();
    // generrate jwt token
    const token = await savedUser.getjwtToken();
    // store in cookies and send response to the client
    res.cookie("token", token, {
      expires: new Date(Date.now() + 8 * 3600000),
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
    });
    res.json({ message: "user created successfully", data: savedUser });
  } catch (error) {
    console.error(error);
    res.status(500).send("error creating user" + error.message);
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    // extract emailId and password values from the request body sent by the client.
    const { email, password } = req.body;

    // check in db user is using emailId
    const user = await User.findOne({ email });
    // if user is not present in DB then we will  send error response
    if (!user) {
      throw new Error("Invalid credentials");
    }

    // ValidPassword is a method define in user model which will compare the password provided by user
    const isValidPassword = user.ValidPassword(password);

    // if pasword is valid then generate jwt token and send response to client browser cokkies
    if (isValidPassword) {
      // getjwtToken is a method define in user model which will generate jwt token
      const token = await user.getjwtToken();
      console.log(token);
      //here we are setting the token in cookies with an expiration time of 8 hours
      res.cookie("token", token, {
        expires: new Date(Date.now() + 8 * 3600000),
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? "none" : "lax",
      });
      res.send(user);
    } else {
      res.status(400).send("Invalid credentials");
    }
  } catch (err) {
    res.status(400).send(err.message);
  }
});

authRouter.post("/Logout", async (req, res) => {
  try {
    // set the token cookies to null and expire it immediately
    res.cookie("token", null, {
      expires: new Date(Date.now()),
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
    });
    res.send("Logout successfully");
  } catch (error) {
    res.status(500).send("Error occurred while logging out " + error.message);
  }
});

module.exports = authRouter;
