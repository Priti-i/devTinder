const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const app = express();
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());
const mongoose = require('mongoose');
const mongoURI=require("./config/database");
// all routers
const authRouter=require("./routes/auth");
const profileRouter=require("./routes/profile");
const requestRouter=require("./routes/requests");
const userRouter=require("./routes/user");
app.use("/",authRouter);
app.use("/",profileRouter);
app.use("/",requestRouter);
app.use("/",userRouter);

mongoose.connect(mongoURI)
  .then(() => {console.log('Connected to MongoDB!');
    app.listen(3000,()=>{
    console.log("server is running");
});
  
  }
)
  .catch(err => console.error('Connection error:', err));


