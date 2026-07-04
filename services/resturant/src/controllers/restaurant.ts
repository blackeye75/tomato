import axios from "axios";
import { Response } from "express";
import getBuffer from "../config/datauri.js";
import { AuthenticatedRequest } from "../middleware/isAuth.js";
import TryCatch from "../middleware/tryCatch.js";
import Restaurant from "../model/Resturant.js";
import jwt from "jsonwebtoken";

export const addRestaurants = TryCatch(
 async (req: AuthenticatedRequest, res) => {
  const user = req.user;
  if (!user) return res.status(401).json({ message: "Unauthorized" });
  const existingRestaurants = await Restaurant.findOne({ owner_id: user._id });
  if (existingRestaurants) {
   return res.status(400).json({ message: "Resturant already exists" });
  }
  // console.log(req.body)
  const { name, description, latitude, longitude, formattedAddress, phone } =
   req.body;
  if (!name || !latitude || !longitude) {
   return res
    .status(400)
    .json({ message: "All feilds are required, please give all details" });
  }
  const file = req.file;

  if (!file) {
   return res.status(400).json({ message: "Please give all details " });
  }
  // console.log(file)
  const fileBuffer = getBuffer(file);
  if (!fileBuffer?.content) {
   return res.status(500).json({
    message: "Failed to create file buffer",
   });
  }
  const { data: uploadResult } = await axios.post(
   `${process.env.UTILS_SERVICE}/api/upload`,
   { buffer: fileBuffer.content },
  );
  const restaurant = await Restaurant.create({
   name,
   description,
   phone,
   image: uploadResult.url,
   ownerId: user._id,
   autoLocation: {
    type: "Point",
    coordinates: [Number(latitude), Number(longitude)],
    formattedAddress,
   },
   isVerifed: false,
  });
  return res.status(201).json({
   message: "Restaurant Created Successfully",
   restaurant,
  });
 },
);

export const fetchMyRestaurant = TryCatch(
 async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) {
   return res.status(401).json({ message: "Please Login" });
  }
  const restaurant = await Restaurant.findOne({ ownerId: req.user._id });
  if (!restaurant) {
   return res.status(400).json({ message: "No Restaurant found" });
  }
  if (!req.user.restaurantId) {
   const token = jwt.sign(
    {
     user: {
      ...req.user,
      restaurantId: restaurant._id,
     },
    },
    process.env.JWT_SEC as string,
    { expiresIn: "15d" },
   );
   return res.json({ restaurant, token });
  }
  return res.json({ restaurant });
 },
);

export const updateStatusRestaurant = TryCatch(
 async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) {
   return res.status(403).json({ message: "Please Login" });
  }
  const { status } = req.body;
  if (typeof status !== "boolean") {
   return res.status(400).json({ message: "Status must be boolean" });
  }
  const restaurant = await Restaurant.findOneAndUpdate(
   { ownerId: req.user._id },
   { isOpen: status },
   { new: true },
  );
  if (!restaurant) {
   return res.status(404).json({ message: "Restaurant not found" });
  }
  res.json({ message: "Restaurant Status Updated", restaurant });
 },
);

export const updateRestaurant = TryCatch(
 async (req: AuthenticatedRequest, res) => {
  if (!req.user) {
   return res.status(403).json({ message: "Please Login" });
  }
  const { name, description } = req.body;
  const restaurant = await Restaurant.findOneAndUpdate(
   { ownerId: req.user._id },
   { name, description },
   { new: true },
  );
  if (!restaurant) {
   return res.status(404).json({ message: "Restaurant not found" });
  }
  res.json({ message: "Restaurant Updated", restaurant });
 },
);
