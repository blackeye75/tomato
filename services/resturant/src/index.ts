import express from "express";
import connectDB from "./config/db.js";
import dotenv from "dotenv";
import cors from "cors";
import restaurantRoute from "./routes/restaurant.js";
dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());
const PORT = process.env.PORT || 5001;

app.use("/api/restaurant", restaurantRoute);

app.listen(PORT, () => {
 console.log(`Restaurant service is running on port ${PORT}`);
 connectDB();
});
