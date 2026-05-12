const mongoose=require("mongoose");
const userSchema=mongoose.Schema({
    firstName:{
        type:String,
        require:true,
        minlength:4,
        maxlength:40,
    },
    lastName:{
        type:String,
    },
    email:{
      type:String,
      require:true,
      lowercase:true,
      unique:true,
      trim:true,
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
    }
    
},{
    timestamp:true
});
const User=mongoose.model("user",userSchema);
module.exports=User;