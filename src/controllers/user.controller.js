import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js"
import { User } from "../models/user.model.js";
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import {ApiResponse}  from "../utils/ApiResponse.js"


const registerUser=asyncHandler(async (req,res)=>{
    // destructure field from req.body
    const {fullName,username,email,password}=req.body;

    console.log("email ",email);
    console.log("fullname",fullName);

    // validing if field is empty or not
    if( [email,fullName,username,password].some((field)=> field?.trim()==="")){
        throw new ApiError(400,"All fields are required");
    }
     
    // Check for User is already registered by using username and email
    const existedUser=await User.findOne({ $or:[{username},{email}]});
    if(existedUser){
        throw new ApiError(409,"User with email or username already register");
    }
    // getting localFilePath of avatar and coverImage from multer middlewares it gives access of re.files
   const avatarLocalFilePath=req.files?.avatar[0]?.path
   const coverImageLocalFilePath=req.files?.coverImage[0]?.path;

    // checking avatar localFilePath present or not because it is required field   
   if(!avatarLocalFilePath){
    throw new ApiError(400,"avatar files is required");
   }
   
  // Uploading avatar img and coverImage to the cloudinary 
   const avatar= await uploadOnCloudinary(avatarLocalFilePath);
   const coverImage=await uploadOnCloudinary(coverImageLocalFilePath);
  
   if (!avatar) {
    throw new ApiError(400, "Avatar file is required")
     }
   
    //  create entry in DB
   const user= await User.create(
                                 {fullName,
                                  username:username.toLowerCase(),
                                  email,
                                  avatar:avatar.url,
                                  coverImage:coverImage?.url || "",
                                  password,
                                });
  
 //  if user is successfullly cretead in mongoDb we get _id we remove the password and refreshToken
 // because we need to send data to user except password and refreshToken 
  const createdUser= await User.findById(user._id).select("-password -refreshToken");

 //  send error if user is not cretaed
  if(!createdUser){
    throw new ApiError(500,"Something went wrong while registering the user");
  }
  
//   sending response that user is successfully register and with data also
  return res.status(201).json(
    new ApiResponse(200, createdUser, "User registered Successfully")
  )
})

export {registerUser}
