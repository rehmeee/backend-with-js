// by using this middleware we extract the information from the access token by decoding it

import { asyncHandler } from "./asyncHandler.js";
import jwt from "jsonwebtoken";
import { User } from "./user.model.js";
export const authMiddleWare = asyncHandler(async (req, res, next) => {
  // collect the accsss token
  // decode it
  // get the user
  // and pass the user to the requect
  console.log(req);
  const token =(req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")).trim()
    
    
  console.log(`this i s access token "${token}"`);
  if (!token) {
    throw new Error("token not found");
  }
  const secretKey = "lajdofjoaieoa8er9798f";
  const decodedToken = jwt.verify(token, secretKey);
  if (!decodedToken) {
    throw new Error("token is incorrect");
    console.error("error while token verification")
  }
 const user = await User.findById(decodedToken._id)

  req.user = user;
  next()
});
