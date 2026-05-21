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

requestRouter.post("/request/review/:status/:requestId", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;
        const { status, requestId } = req.params;

        const isAllowed = ["accepted", "rejected"];

        if (!isAllowed.includes(status)) {
            return res.status(400).send("Invalid status");
        }

        const connectionRequest = await ConnectionRequest.findOne({
            _id: requestId,
            toUserId: loggedInUser._id
        });

        console.log("Found request:", connectionRequest);

        if (!connectionRequest) {
            return res.status(400).send("Connection not found");
        }

        if (connectionRequest.status !== "intrested") {
            return res.status(400).send("Request already reviewed");
        }

        connectionRequest.status = status;

        const data = await connectionRequest.save();

        return res.send({
            message: "Request reviewed successfully",
            data
        });

    } catch (error) {
        res.status(400).send({
            message: error.message
        });
    }
});
module.exports=requestRouter;
