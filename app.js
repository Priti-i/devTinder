const express=require('express');
require("./src/config/database");
const app=express();
const mongoose = require('mongoose');
const mongoURI=require("./src/config/database");

const User=require("./src/models/user");
app.user(express.json());
app.post("/signup",async(req,res)=>{
    const user=new User(req.body);
    try{
          await user.save();
          res.send("user created");
    }
    catch(error)
    {
    console.error(error);
    res.status(500).send("error creating user");  
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


