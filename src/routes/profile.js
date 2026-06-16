const express=require("express");
const profileRouter=express.Router();
const User=require("../models/user");
const {userAuth}=require("../middlewares/auth");
const {validateEditProfile}=require("../Util/Healper");
const jwt=require("jsonwebtoken");
const bcrypt=require("bcrypt");

profileRouter.get("/profile/view", userAuth,async (req, res) => {
  try {
    // get all user detail from req.user
    const user=req.user;
    res.send(user); // and then send to the user

  } catch (error) {
    res.status(400).send(error.message);
  }
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  

  try {
    if (!validateEditProfile(req)) {
      throw new Error("This field cannot be changed");
    }

    const loggedInUser = req.user;

    // update fields dynamically
    Object.keys(req.body).forEach((key) => {
      loggedInUser[key] = req.body[key];
    });

    // save updated data
    await loggedInUser.save();

    res.send({
      message: "Profile updated successfully",
      data: loggedInUser,
    });

  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});

profileRouter.post("/password/change", async (req, res) => {
  try {
    const { emailId } = req.body;
    
        const user = await User.findOne({ email: emailId });
    if (!user) {
      return res.status(400).send("User not found");
    }

    const resetToken = jwt.sign(
      { userId: user._id },
      "@webtindertoken",
      { expiresIn: "15m" }
    );

    const resetLink = `http://localhost:5173/reset-password/${resetToken}`;

    res.send({
      message: "Password reset link sent",
      resetLink
    });

  } catch (error) {
    res.status(500).send(error.message);
  }
});


profileRouter.post("/reset-password/:token", async (req, res) => {
  try {
    const { token } = req.params;
    const { newPassword } = req.body;
    console.log(token);

    const decoded = jwt.verify(token,"@webtindertoken");

    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(400).send("User not found");
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;

    await user.save();

    res.send("Password updated successfully");

  } catch (error) {
    res.status(400).send("Invalid or expired token  "+error.message);
  }
});

module.exports=profileRouter;