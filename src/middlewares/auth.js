// const jwt=require("jsonwebtoken");
// const User=require("../models/user");
// const userAuth=async(req,res,next)=>{
// //read the token from req cookies
// try{

// const {token}=req.cookies;
// if(!token)
// {
//    res.status(401).send("user is not logged in");
// }
// const decodedMessage=await jwt.verify(token,"@webtindertoken"); // verify token
// const {_id}=decodedMessage;
// console.log("after token created ", decodedMessage);
// const user= await User.findById(_id);
// if(!user){
//     throw new Error("user not found");
// }

// req.user=user; 
// next();
// }catch(error)
// {
//     res.status(400).status(error.message);
// }

// }
// module.exports={userAuth};

const jwt = require("jsonwebtoken");
const User = require("../models/user");

const userAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;

    if (!token) {
      return res.status(401).send("user is not logged in");
    }

    const decodedMessage = jwt.verify(
      token,
      "@webtindertoken"
    );

    const { _id } = decodedMessage;

    const user = await User.findById(_id);

    if (!user) {
      return res.status(404).send("user not found");
    }

    req.user = user;

    next();
  } catch (error) {
    return res.status(401).send(error.message);
  }
};

module.exports = { userAuth };