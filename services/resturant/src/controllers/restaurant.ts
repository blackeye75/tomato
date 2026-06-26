import axios from "axios";
import getBuffer from "../config/datauri.js";
import { AuthenticatedRequest } from "../middleware/isAuth.js";
import TryCatch from "../middleware/tryCatch.js";
import Resturant from "../model/Resturant.js";

export const addRestaurants = TryCatch(
 async (req: AuthenticatedRequest, res) => {
  const user = req.user;
  if (!user) return res.status(401).json({ message: "Unauthorize" });
  const existingRestaurants = await Resturant.findOne({ owner_id: user._id });
  if (existingRestaurants) {
   return res.status(400).json({ message: "Resturant already exists" });
  }
  const { name, description, latitude, longitude, formattedAddress, phone } =
   req.body;
  if (!name || !latitude || longitude) {
   return res
    .status(400)
    .json({ message: "All feilds are required, please give all details" });
  }
  const file = req.file;

  if (!file) {
   return res.status(400).json({ message: "Please give all details " });
  }
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
  const restaurant = await Resturant.create({
    name,description,phone,image:uploadResult.url,ownerId:user._id,autoLocation:{type:"Point"}
  })
 },
);
