const express=require('express');
require("./config/database");
const app=express();
const mongoose = require('mongoose');

const mongoURI=require("./config/database");
const cookieParser=require("cookie-parser");
app.use(express.json());
app.use(cookieParser());
// all routers
const authRouter=require("./routes/auth");
const profileRouter=require("./routes/profile");
const requestRouter=require("./routes/requests");
app.use("/",authRouter);
app.use("/",profileRouter);
app.use("/",requestRouter);
//const User=require("./models/user");



//get  user
app.get("/getuser",async(req,res)=>{
  const userEmail=req.body.email;
  const user=await User.findOne({email:userEmail});
  if(!user)
  {
    res.status(404).send("user not found");
  }
  else{
      res.send(user);
  }
})

//get api
app.get("/getAllUser",async(res,req)=>{

  try{
    const users=await User.find({});
    req.send(users);

  }catch(error)
  {
    console.error(error);
    req.status(500).send("somethinf went wrong")
  }
})









//delete Api by id
app.delete("/deleteUser",async(req,res)=>{
  const userId=req.body.id;
  try{
    const deleteUser=await User.findByIdAndDelete(userId);
    res.send("user deleted")
  }catch(error)
  {
    res.status(500).send("error deleting user");
  }
})

// update apin data
app.patch("/updateUser",async(req,res)=>{
  const userId=req.body.userId;
  const updateData=req.body;
  try{
    const user=await User.findByIdAndUpdate({_id:userId}, updateData,  {runValidators: true });
    res.send("update data");
  }catch(error)
  {
    res.status(500).send("error updating user",error.message);
  }
})



mongoose.connect(mongoURI)
  .then(() => {console.log('Connected to MongoDB!');
    app.listen(3000,()=>{
    console.log("server is running");
});
  
  }
)
  .catch(err => console.error('Connection error:', err));


