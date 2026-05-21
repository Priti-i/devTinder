const mongoose=require("mongoose");
const validator = require("validator");
const bcrypt=require("bcrypt");
const jwt=require("jsonwebtoken");

const userSchema=new mongoose.Schema({
    firstName:{
        type:String,
        required:true,
        minlength:4,
        maxlength:40,
    },
    lastName:{
        type:String,
    },
    email:{
      type:String,
      required:true,
      lowercase:true,
      unique:true,
      trim:true,
      validate (value){
        if(!validator.isEmail(value))
        {
            throw new Error("invalid email");
        }
      }
    },
    password:{
        type:String
    },
    age:{
        type:Number,
        min:18,
        max:50
    },
    gender:{
        type:String,
        validate(value)
        {
            if(!["male","female","other"].includes(value))
            {
                throw new Error("this is not proper gender");
            }

        }

    },
    About:{
         type:String,
         default:"default description in your peofile",
    },
    profileUrl:{
        type:String,
        default:"https://www.flaticon.com/free-icon/profile_3135715"
    },
   createdAt: {
  type: Date,
  default: Date.now
}
    
}, {
  timestamps: true
});

userSchema.index({firstName:1});


userSchema.methods.getjwtToken=async function(){
    const user=this;
    const token =await jwt.sign({_id:this._id},"@webtindertoken",{expiresIn:"1d"});
     return token;
}

userSchema.methods.ValidPassword=async function(passwordInputByUser){
    const user=this;
    const isMatch=await bcrypt.compare(passwordInputByUser,this.password);
    return isMatch;
}
const User=mongoose.model("user",userSchema);
module.exports=User;
