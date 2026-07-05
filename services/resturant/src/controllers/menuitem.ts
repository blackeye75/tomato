import axios from "axios";
import getBuffer from "../config/datauri.js";
import { AuthenticatedRequest } from "../middleware/isAuth.js";
import TryCatch from "../middleware/tryCatch.js";
import Resturant from "../model/Resturant.js";
import MenuItems from "../model/MenuItems.js";

export const addMenuItem = TryCatch(async (req: AuthenticatedRequest, res) => {
 if (!req.user) {
  return res.status(401).json({ message: "Please Login" });
 }
 const restaurant = await Resturant.findOne({
  ownerId: req.user._id,
 });
 if (!restaurant) {
  return res.status(404).json({ message: "No Restaurant Found " });
 }
 const { name, description, price } = req.body;
 if (!name || !price) {
  return res
   .status(401)
   .json({ message: "Please provide all details,Name and price are required" });
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
 const item = await MenuItems.create({
  name,
  description,
  price,
  restaurantId: restaurant._id,
  image: uploadResult.url,
 });
 res.json({ message: "Item Added Sucessfully", item });
});

export const getAllItem = TryCatch(async (req: AuthenticatedRequest, res) => {
 const { id } = req.params;
 if (!id) {
  return res.status(400).json({ message: "id is Required" });
 }
 const item = await MenuItems.find({ restaurantId: id });
 res.json(item);
});

export const deleteMenuItem = TryCatch(
 async (req: AuthenticatedRequest, res) => {
  if (!req.user) {
   return res.status(401).json({ message: "Please Login" });
  }
  const { itemId } = req.params;
  if (!itemId) {
   return res.status(400).json({ message: "Id Is Required In params" });
  }
  const item = await MenuItems.findById(itemId);
  if (!item) {
   return res.status(404).json({ message: "Item Not Found" });
  }
  const restaurant = await Resturant.findOne({
   ownerId: req.user._id,
   _id: item.restaurantId,
  });
  if (!restaurant) {
   return res.status(404).json({ message: "Restaurant Not Found" });
  }
  await item.deleteOne();
  res.status(200).json({ message: "Menu Item Deleted Successfully" });
 },
);

export const toggleMenuItemAvailability = TryCatch(
 async (req: AuthenticatedRequest, res) => {
  if (!req.user) {
   return res.status(401).json({ message: "Please Login" });
  }
  const { itemId } = req.params;
  if (!itemId) {
   return res.status(400).json({ message: "Id Is Required In params" });
  }
  const item = await MenuItems.findById(itemId);
  if (!item) {
   return res.status(404).json({ message: "Item Not Found" });
  }
  const restaurant = await Resturant.findOne({
   ownerId: req.user._id,
   _id: item.restaurantId,
  });
  if (!restaurant) {
   return res.status(404).json({ message: "Restaurant Not Found" });
  }
  item.isAvailable = !item.isAvailable;
  await item.save();
  res.status(200).json({message:`Menu Item Marked as ${item.isAvailable ? "Available" : "Not Available"} Now`,item});
 },
);
