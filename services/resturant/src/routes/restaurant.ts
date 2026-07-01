import express from "express";
import { isAuth, isSeller } from "../middleware/isAuth.js";
import {
 addRestaurants,
 fetchMyRestaurant,
} from "../controllers/restaurant.js";

const router = express.Router();

router.post("/new", isAuth, isSeller, addRestaurants);
router.get("/my", isAuth, isSeller, fetchMyRestaurant);

export default router;
