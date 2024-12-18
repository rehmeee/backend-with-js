import { asyncHandler } from "./asyncHandler.js";
import { v2 as cloudinary } from "cloudinary";
import { User } from "./user.model.js";

import jwt from "jsonwebtoken";

// cloudinary configuration
cloudinary.config({
  cloud_name: "druwqr9lo",
  api_key: "861241485628533",
  api_secret: "hVEbZGuqLqYbPOiPr0ORXJgBJKM", // Click 'View API Keys' above to copy your API secret
});

// genrate access and refresh token
const genrateRefreshAndAcessToken = async (userid) => {
  try {
    const user = await User.findById(userid);
    const comingaccessToken = user.genrateAcessTokens();
    const comingrefreshToken = user.genrateRefreshTokens();
    user.refreshToken = comingrefreshToken;
    await user.save({ validateBeforeSave: false });

    return { comingaccessToken, comingrefreshToken };
  } catch (error) {
    console.error("erroe while genrating the tokens", error.message);
  }
};
// upload to cloudinary

const uploadToCloudinary = async (localfilePath) => {
  try {
    const res = await cloudinary.uploader.upload(localfilePath, {
      resource_type: "auto",
    });
    console.log("this is the response from the cloudinay ", res);
    return res;
  } catch (error) {
    throw new Error("Something went wrong while uploading to cloudinary");
  }
};

const rigesterUser = asyncHandler(async (req, res) => {
  // res.status(200).json({
  //     message:"User rigestered successfully"
  // })
  console.log(req.body);
  console.log("this is teh body of the files", req.files);
  const { fullName, email, username, password } = req.body;
  if (
    [fullName, email, username, password].some((field) => field?.trim() === "")
  ) {
    throw new Error("All fields are required");
  }
  const existedUser = await User.findOne({
    $or: [{ email }, { username }],
  });
  if (existedUser) {
    throw new Error("User already existed");
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
    coverImage: coverImage.url,
  });
  const userCreated = await User.findById(user._id);
  if (!userCreated) {
    throw new Error("User not created");
  }

  return res.status(200).json({ userCreated });
});

// login user
const userLogin = asyncHandler(async (req, res) => {
  // steps to login the user
  // get data from the request body
  // check either eamil  and username is provided or not
  // check password is correct or not
  // genrate tokens
  // send the responst with tokens

  const { username, email, password } = req.body;
  if (!(username || email)) {
    throw new Error("username and email is required");
  }

  const user = await User.findOne({
    $or: [{ username }, { email }],
  });
  if (!user) {
    throw new Error("user not found");
  }
  const validuser = await user.checkPasswordisCorrect(password);
  if (!validuser) {
    throw new Error("password is incorrect");
  }

  const { comingaccessToken, comingrefreshToken } =
    await genrateRefreshAndAcessToken(user._id);

  const currentUser = await User.findById(user._id);
  console.log("previous user ", user);
  console.log("current user ", currentUser);

  const options = {
    httponly: true,
    secure: true,
  };
  return res
    .status(200)
    .cookie("accessToken", comingaccessToken, options)
    .cookie("refreshToken", comingrefreshToken, options)
    .json({
      user: user,
      comingaccessToken,
      comingrefreshToken,
      message: "you are logind successfully ",
    });
});

// logout the user

const userLougout = asyncHandler(async (req, res) => {
  //
  const userid = req.user?._id;
  if (!userid) {
    throw new Error("user id not found");
  }
  // by default the findoneandupdate returns the updated document of use the option new to true it give the new document
  const user = await User.findOneAndUpdate(
    userid,
    {
      refreshToken: undefined,
    },
    {
      new: true,
    }
  );
  if (!user) {
    throw new Error("user  not found");
  }
  const options = {
    httponly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json({
      message: "user logout successfully",
    });
});

// genrate the token

const genrateTokens = asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    throw new Error("token not found ");
  }

  const decodedToken = jwt.verify(refreshToken, "lkdlasfljadkfo2349814091");
  if (!decodedToken) {
    throw new Error("token invalid ");
  }
  const user = await User.findById(decodedToken?._id).select("-password ");
  if (!user) {
    throw new Error("user not found ");
  }
  if (refreshToken !== user.refreshToken) {
    throw new Error("unaturized access");
  }
  console.log(user);
  const { comingaccessToken, comingrefreshToken } =
    await genrateRefreshAndAcessToken(user._id);
  console.log("tokens", comingaccessToken);
  const options = {
    httponly: true,
    secure: true,
  };
  return res
    .status(200)
    .cookie("accessToken", comingaccessToken, options)
    .cookie("refreshToken", comingrefreshToken, options)
    .json({
      user,
      comingaccessToken,
      comingrefreshToken,
      message: "new access and refresh tokens",
    });
});

// update password of the user

const updatePassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  if (!oldPassword || !newPassword) {
    throw new Error("plx provide the old and new password");
  }

  const user = await User.findById(req.user?._id);
  const validUser = await user.checkPasswordisCorrect(oldPassword);
  if (!validUser) {
    throw new Error("your passsword is incorrect");
  }
  user.password = newPassword;
  await user.save({ validateBeforeSave: false });
  return res.status(200).json({ message: "password updated successfully" });
});

// give the current user
const giveCurrentUser = asyncHandler(async (req, res) => {
  return res.status(200).json(req.user);
});

// updated the account details
const updateAccountDetails = asyncHandler(async (req, res) => {
  const { fullName, email } = req.body;

  if (!fullName || !email) {
    throw new Error("plz provid the full name and email ");
  }

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        fullName,
        email: email,
      },
    },
    { new: true }
  ).select("-password");
  if (!user) {
    throw new Error("user not found ");
  }

  return res
    .status(200)
    .json({ user, message: "password updated successfully" });
});

// update the avtar of the user

const updateAvtar = asyncHandler(async (req, res) => {
  const localfilePath = req.file?.path;
  if (!localfilePath) {
    throw new Error("doesnot found the file local path");
  }

  const uploadedfile = await uploadToCloudinary(localfilePath);
  if (!uploadedfile.url) {
    throw new Error("does not found the cloudinary url");
  }
  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        avtar: uploadedfile.url,
      },
    },
    { new: true }
  ).select("-password -refreshToken");

  if(!user){
    throw new Error("user does not found");
  }
  return res
  .status(200)
  .json({
    user,
    message:"avtar file updated successfully"
  })
});

// update the cover image
const updateCoverImage = asyncHandler(async (req, res) => {
    const localfilePath = req.file?.path;
    if (!localfilePath) {
      throw new Error("doesnot found the file local path");
    }
  
    const uploadedfile = await uploadToCloudinary(localfilePath);
    if (!uploadedfile.url) {
      throw new Error("does not found the cloudinary url");
    }
    const user = await User.findByIdAndUpdate(
      req.user?._id,
      {
        $set: {
          coverImage: uploadedfile.url,
        },
      },
      { new: true }
    ).select("-password -refreshToken");
  
    if(!user){
      throw new Error("user does not found");
    }
    return res
    .status(200)
    .json({
      user,
      message:"coverimage file updated successfully"
    })
  });
export {
  rigesterUser,
  userLogin,
  userLougout,
  genrateTokens,
  updatePassword,
  updateAccountDetails,
  giveCurrentUser,
  updateAvtar,
  updateCoverImage
};
