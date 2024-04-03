import mongoose  from "mongoose";
import { Jwt } from "jsonwebtoken";
import bcrypt from "bcryptjs"

const userSchema= new mongoose.Schema(
{
    username:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true,
        index:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true 
    },
    fullName:{
        type:String,
        required:true,
        trim:true,
        index:true,
    },
    avatar:{
        // cloudinary url
        type:String, 
        required:true
        
    },
    coverImage:{
        type:String, 
        
    },
    password:{
        type:String,
        required:[true,'Password is required'],
    }
    ,
    refreshToken:{
        type:String
    },
    watchHistory:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'Video'
        }
    ]

},
{timestamps:true}
);

// pre middleware doest not take callback function we have write normal function becase 
// callBack func has no access of this 
userSchema.pre("save",async function(next){
    if(!this.isModified("password")) return next();

    this.password= await bcrypt.hash(this.password,10);
    next();
})

// injecting methods on schema for comapring of paswword
userSchema.methods.isPasswordCorrect= async function(password){
    return await bcrypt.compare(password,this.password)
}


// accessToken  and refreshToken method insert in schema both are JWT Token 
// both are same but diffrence in  usage
userSchema.methods.generateAccessToken= function(){
   return Jwt.sign(
    {
        _id:this._id,
        email:this.email,
        username:this.username,
        fullName:this.fullName
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
        expiresIn:process.env.ACCESS_TOKEN_EXPIRY
    }
   )
}
userSchema.methods.generateRefreshToken= function(){
    return Jwt.sign(
        {
            _id:this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn:process.env.REFRESH_TOKEN_EXPIRY
        }
       )

}



export const User=mongoose.model('User',userSchema)