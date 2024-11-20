import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    avtar: {
      type: String,
      required: true,
    },
    coverImage: {
      type: String,
    },
  },
  { timestamps: true }
);
// inject middle ware to hash password before saving it on to the database
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});
userSchema.methods.checkPasswordisCorrect = async function (passowrd) {
  return  await bcrypt.compare(passowrd, this.password);
};
userSchema.methods.genrateAcessTokens = function () {
  return jwt.sign(
    {
      _id: this._id,
      username: this.username,
      email: this.email,
    },
    "lajdofjoaieoa8er9798f",
    { expiresIn: "1d" }
  );
};

userSchema.methods.genrateRefreshTokens = function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    "lkdlasfljadkfo2349814091",
    { expiresIn: "10d" }
  );
};

export const User = mongoose.model("User", userSchema);
