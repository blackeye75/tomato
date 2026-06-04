import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import User from "../model/User.js";
import TryCatch from "../middlewares/trycatch.js";

export const loginUser = TryCatch(async(req,res)=>{
   const { email, name, picture } = req.body;
  // if (!email || !name || !picture) {
  //  return res.status(400).json({ message: "Email, name and picture are required" });
  // }
  let user = await User.findOne({ email });
  if (!user) {
   user = await User.create({ email, name, image: picture });
  }
  const token = jwt.sign({ user }, process.env.JWT_SEC as string, {
   expiresIn: "15d",
  });
  res.status(200).json({ message: "Logged in successfully", token, user });
} )
