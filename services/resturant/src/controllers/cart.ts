import mongoose from "mongoose";
import { AuthenticatedRequest } from "../middleware/isAuth.js";
import TryCatch from "../middleware/tryCatch.js";
import Cart from "../model/Cart.js";

export const addTocart = TryCatch(async (req: AuthenticatedRequest, res) => {
 if (!req.user) {
  return res.status(401).json({
   message: "Please Login",
  });
 }
 const userId = req.user._id;
 const { restaurantId, itemId } = req.body;
 if (
  !mongoose.Types.ObjectId.isValid(restaurantId) ||
  mongoose.Types.ObjectId.isValid(itemId)
 ) {
  return res.status(400).json({ message: "Invalid restaurant or item Id" });
 }
 const cartFromDiffrentRestaurant = await Cart.findOne({
  userId,
  restaurantId: { $ne: restaurantId },
 });
});
