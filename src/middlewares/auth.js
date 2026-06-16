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

const jwt = require("jsonwebtoken");   //here Import jsonwebtoken package
const User = require("../models/user"); // import user model(user table)

const userAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies; // get token from cookies

    // check token is not present 
    //If token not found:user is not authenticated ,send error response 401 means:
    //  Unauthorized  return stops further execution.

    if (!token) {
      return res.status(401).send("user is not logged in");
    }
  // here check token is valid or not 
    const decodedMessage = jwt.verify(
      token,
      "@webtindertoken"
    );
    
  // if token is valid then we will get the decoded message which contains userId  (_id)  
    const { _id } = decodedMessage;

  // we will use that userId to find the user in database 
    const user = await User.findById(_id);

    if (!user) {
      return res.status(404).send("user not found");
    }
//attach the user object to req.user for further use in next middlewares or route handlers.
    req.user = user;

    next();
  } catch (error) {
    return res.status(401).send(error.message);
  }
};

module.exports = { userAuth };