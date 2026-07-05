import express from "express"
import { isAuth, isSeller } from "../middleware/isAuth.js"
import { addMenuItem, deleteMenuItem, getAllItem, toggleMenuItemAvailability } from "../controllers/menuitem.js"
const router = express.Router()

router.post("/new",isAuth,isSeller,addMenuItem)
router.get("/all/:id",isAuth,getAllItem)
router.delete("/:id",isAuth,isSeller,deleteMenuItem)
router.patch("/status/:itemId",isAuth,isSeller,toggleMenuItemAvailability)

export default router