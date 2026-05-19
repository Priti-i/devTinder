const express=require("express");
const authRouter=express.Router();
const User=require("../models/user");
const jwt=require("jsonwebtoken");
const bcrypt=require("bcrypt");
const {isValidation}=require("../Util/Healper");

authRouter.post("/signup",async(req,res)=>{
    try{
        isValidation(req);
        const {firstName,lastName,email,password}=req.body;
        const hashPassword=await bcrypt.hash(password,10);
       const user=new User({firstName,lastName,email,password:hashPassword});
          await user.save();
          res.send("user created");
    }
    catch(error)
    {
    console.error(error);
    res.status(500).send("error creating user"+error.message); 

    }
    
});

authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;

    const user = await User.findOne({ email: emailId });

    if (!user) {
      throw new Error("Invalid credentials");
    }

    const isValidPassword = user.ValidPassword(password);

    if (isValidPassword) {
      const token=await user.getjwtToken();
      console.log(token);
      res.cookie("token",token,
        {expires:new Date(Date.now()+8*3600000)}
      );
      res.send("Login successfully");
    } else {
      res.status(400).send("Invalid credentials");
    }

  } catch (err) {
    res.status(400).send(err.message);
  }
});

authRouter.post("/Logout",async(req,res)=>{
try{
res.cookie("token",null,
  {expires:new Date(Date.now()),
});
res.send("Logout successfully");
}catch(error)
{
res.status(500).send("Error occurred while logging out " + error.message);
}
});

module.exports=authRouter;