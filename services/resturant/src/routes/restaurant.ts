import express from "express";
import { isAuth, isSeller } from "../middleware/isAuth.js";
import uploadFile from "../middleware/multer.js";
import {
 addRestaurants,
 fetchMyRestaurant,
 fetchSingleRestaurant,
 getNearbyRestaurant,
 updateRestaurant,
 updateStatusRestaurant,
} from "../controllers/restaurant.js";

const router = express.Router()

router.post("/new", isAuth, isSeller, uploadFile, addRestaurants);
router.get("/my", isAuth, isSeller, fetchMyRestaurant);
router.put("/status", isAuth, isSeller, updateStatusRestaurant);
router.put("/update", isAuth, isSeller, updateRestaurant);
router.get("/all",isAuth,getNearbyRestaurant)
router.get("/:id",isAuth,fetchSingleRestaurant)
export default router;
