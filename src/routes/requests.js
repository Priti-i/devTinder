const express=require("express");
const requestRouter=express.Router();
const User=require("../models/user");
const {userAuth}=require("../middlewares/auth");
const ConnectionRequest=require("../models/connectionRequest");

requestRouter.post("/request/send/:status/:toUserId",userAuth,async(req,res)=>{
    try{
        const fromUserId=req.user._id;
        const toUserId=req.params.toUserId;
        const status=req.params.status;
        const isAllowed=["ignore","intrested"];

        if(!isAllowed.includes(status))
        {
            return res.status(400).json("invalid status");
        }
        const toUser= await User.findById(toUserId);
        if(!toUser){
            throw new Error("User not found...");
        }
        if(toUserId==fromUserId)
        {
            throw new Error("You cannot send request to yourself");
        }
        const existConnectionRequest= await ConnectionRequest.findOne(
            {$or:[
                {fromUserId,toUserId},
                {fromUserId:toUserId,toUserId:fromUserId}
            ]}
        );
        if(existConnectionRequest)
        {
            return res.status(400).json("Request already exist");
        }
        const connectionRequest=new ConnectionRequest({fromUserId,toUserId,status});
        const data=await connectionRequest.save();
        res.json({
            message:"Request send successfully",
            data
        });

    }catch(error)
    {
        res.status(400).send(error.message);
    }
})
module.exports=requestRouter;
