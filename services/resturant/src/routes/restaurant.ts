import express from "express";
import { isAuth, isSeller } from "../middleware/isAuth.js";
import uploadFile from "../middleware/multer.js";
import {
 addRestaurants,
 fetchMyRestaurant,
} from "../controllers/restaurant.js";

const router = express.Router();

router.post("/new", isAuth, isSeller, uploadFile, addRestaurants);
router.get("/my", isAuth, isSeller, fetchMyRestaurant);

export default router;
