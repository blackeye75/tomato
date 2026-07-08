import express from "express";
import connectDB from "./config/db.js";
import dotenv from "dotenv";
import cors from "cors";
import restaurantRoute from "./routes/restaurant.js";
import menuRoute from "./routes/menuitem.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: "10mb" }));  
app.use(express.urlencoded({ limit: "10mb", extended: true }));
const PORT = process.env.PORT || 5001;

app.use("/api/restaurant", restaurantRoute);
app.use("/api/item", menuRoute);

app.listen(PORT, () => {
 console.log(`Restaurant service is running on port ${PORT}`);
 connectDB();
});
