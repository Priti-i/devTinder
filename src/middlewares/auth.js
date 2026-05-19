const jwt=require("jsonwebtoken");
const User=require("../models/user");
const userAuth=async(req,res,next)=>{
//read the token from req cookies
try{

const {token}=req.cookies;
if(!token)
{
   throw new Error("Token not found");
}
const decodedMessage=await jwt.verify(token,"@webtindertoken");
const{_id}=decodedMessage;
const user= await User.findById(_id);
if(!user){
    throw new Error("user not found");
}

req.user=user; 
next();
}catch(error)
{
    res.status(400).status(error.message);
}

}
module.exports={userAuth};