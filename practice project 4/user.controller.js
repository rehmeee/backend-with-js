import { asyncHandler } from "./asyncHandler.js";

const userRegister  = asyncHandler(async(req,res)=>{
    console.log(req.body);
    return res.status(200).json({
        
        message: "User registered successfully"
    })
})

export { userRegister }