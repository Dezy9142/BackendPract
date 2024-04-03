import {v2 as cloudinary} from "cloudinary"
import fs from "fs"


          
cloudinary.config({ 
  cloud_name:process.env.CLOUDINARY_CLOUD_NAME,  
  api_key:process.env.CLOUDINARY_API_SECCRET , 
  api_secret:process.env.CLOUDINARY_API_KEY
});


const uploadOnCloudinary=async (localFilePath)=>{
  try {
       if(!localFilePath) return null;
         
      //  upload file on cloudinary
        const response=await cloudinary.uploader.upload(localFilePath,
        {resource_type:"auto"})
        
        console.log("File successfully uploaded ",response.url);

        // if successfully uploaded on cloudinary then unlink from local server
        fs.unlinkSync(localFilePath);
        return response;

  } catch (error) {
    // remove the locally saved temporary file as the upload operation got failed
    fs.unlinkSync(localFilePath);
     return null;
  }
}


export {uploadOnCloudinary}