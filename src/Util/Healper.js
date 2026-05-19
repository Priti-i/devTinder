const validator = require("validator");
const isValidation=(req)=>{
    const {firstName,email,  password, age,gender,}=req.body;
    if(!email )
    {
        throw new Error("Email required");
        
    }
    if(!firstName)
    {
        throw new Error("First name required");
        
    }
    else if(firstName.length<4 || firstName.length>15){

        throw new Error("first name length should be 4 to 15");
    }
    else if(!validator.isEmail(email))
    {
        throw new Error("Invalid Email");
    }

};
const validateEditProfile=(req)=>{
    const allowedEditFields=
    ["firstName","lastName","email","about","age","gender","profileUrl"];

    const isEditAllowed=Object.keys(req.body).every(
        (key)=>allowedEditFields.includes(key));

        return isEditAllowed;

}
module.exports={isValidation, validateEditProfile};
