const express=require("express");
const userRouter=express.Router();
const {userAuth}=require("../middlewares/auth");
const ConnectionRequests=require("../models/connectionRequest");
const User = require("../models/user");


userRouter.get("/user/requests/receive",userAuth,async(req,res)=>{
    try{
        const logedInUser=req.user;
        const connectionRequests=await ConnectionRequests.find(
            {
                toUserId:logedInUser._id,
                status:"intrested",
            }
        ).populate("fromUserId",["firstName","lastName"]);

        res.json({
            message:"Connection Requests fetched successfully:",
            data:connectionRequests
        })
    }catch(error)
    {
        res.status(400).send({"message": error.message});
    }
});

userRouter.get("/user/requests",userAuth,async(req,res)=>{
    try{
        const logedInUser=req.user;
        const connectionRequests=await ConnectionRequests.find({
            $or:[
                {toUserId:logedInUser._id,status:"accepted"},
                {fromUserId:logedInUser._id,status:"accepted"}
            ],
        })   .populate("toUserId", "firstName lastName profileUrl About")
        .populate("fromUserId", "firstName lastName  profileUrl About");

const data=connectionRequests.map((row)=>{
    if(row.fromUserId.toString()===logedInUser._id.toString())
    {
        return row.toUserId;
    }
    
        return row.fromUserId;
    });

    res.json({data});

    }catch(error)
    {
        res.status(400).send({"message": error.message});
    }
})

userRouter.get("/user/feed",userAuth,async(req,res)=>{
    try{
        const page=parseInt(req.query.page) || 1;
        const limit=parseInt(req.query.limit) || 10;
        const skip=(page-1)*limit;
        const logedInUser=req.user;
        const connectionRequests=await ConnectionRequests.find({
            $or:[
                {toUserId:logedInUser._id},
                {fromUserId:logedInUser._id}
                
            ]
        })
     
      const hideUser=new Set();
      connectionRequests.forEach(request=>{
        hideUser.add(request.fromUserId.toString());
        hideUser.add(request.toUserId.toString());
      })
   
      const user =await User.find({
        $and:[
            {_id:{$ne:logedInUser._id}},
            {_id:{$nin:Array.from(hideUser)}}
        ],
    }).select("firstName lastName age").skip(skip).limit(limit);
    res.json({data:user});

    }catch(error)
    {
        res.status(400).send({message:error.message});
    }
});
module.exports=userRouter;