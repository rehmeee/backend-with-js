import {asyncHandler} from "./asyncHandler.js"
import {v2 as cloudinary} from "cloudinary"
import {User} from "./user.model.js"

// cloudinary configuration
cloudinary.config({
    cloud_name: "druwqr9lo",
    api_key: "861241485628533",
    api_secret: "hVEbZGuqLqYbPOiPr0ORXJgBJKM", // Click 'View API Keys' above to copy your API secret
  });

  // upload to cloudinary 

  const uploadToCloudinary = async (localfilePath)=>{
       try {
        const res =await cloudinary.uploader.upload(localfilePath,{
            resource_type: "auto"
        })
        console.log("this is the response from the cloudinay ", res);
        return res;
       } catch (error) {
        throw new Error("Something went wrong while uploading to cloudinary")
       }
  }



const rigesterUser = asyncHandler(async(req,res)=>{
    // res.status(200).json({
    //     message:"User rigestered successfully"
    // })
    console.log(req.body);
    console.log("this is teh body of the files",req.files);
    const {fullName, email, username, password} = req.body;
    if([fullName,email,username,password].some((field)=>field?.trim() === "")){
        throw new Error("All fields are required")
    }
    const existedUser = await User.findOne({
        $or:[{email},{username}]
    })
    if(existedUser){
        throw new Error("User already existed")
    }
    const avtarLocalPath = req.files.avtar[0].path;
    const coverImageLocalPath = req.files.coverImage[0].path;
    const avtar = await uploadToCloudinary(avtarLocalPath);
    const coverImage = await uploadToCloudinary(coverImageLocalPath);
    const user = await User.create({
        fullName,
        email,
        username,
        password,
        avtar: avtar.url,
        coverImage : coverImage.url
    })
    const userCreated = await User.findById(user._id);
    if(!userCreated){
        throw new Error("User not created")
    }

    return res.status(200).json({userCreated})


})

export {rigesterUser}