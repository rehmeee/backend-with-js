import {v2 as cloudinary } from "cloudinary"
import fs from "fs"

// CLOUD_NAME = druwqr9lo
// CLOUD_KEY = 861241485628533
// CLOUD_SECRET = hVEbZGuqLqYbPOiPr0ORXJgBJKM
cloudinary.config({
    cloud_name: "druwqr9lo",
    api_key:"861241485628533" ,
    api_secret: "hVEbZGuqLqYbPOiPr0ORXJgBJKM", // Click 'View API Keys' above to copy your API secret
  });
 const uploadtoCloudinary = async (localpath)=>{
    try {
        if(!localpath) return null
       const response =   await cloudinary.uploader.upload(localpath, {
            resource_type: "image"

        })
        console.log(response.url);
        return response
    } catch (error) {
        fs.unlinkSync(localpath)
        return null 
    }
}
export {uploadtoCloudinary}