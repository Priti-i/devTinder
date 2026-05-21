const mongoose=require("mongoose");

const connectionRequestSchema=new mongoose.Schema({
    fromUserId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user" , //refrence from user model
        required:true,
    },
    toUserId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
    },
    status:{
        type:String,
        enum:{
           values: ["ignore","intrested","accepted","rejected",],
            message:"{VALUE} is invalid status"
        }
    }
},{
    timestamps:true
}); 
// connectionRequestSchema.pre("save",function(next){
//     const connectionRequest=this;
//     if(connectionRequest.toUserId.equals(connectionRequest.fromUserId))
//     {
//         throw new Error("you cannot send connection request to yourself");
//     }
//     next();
// });

const ConnectionRequest=mongoose.model("connectionRequest",connectionRequestSchema);
module.exports=ConnectionRequest; 