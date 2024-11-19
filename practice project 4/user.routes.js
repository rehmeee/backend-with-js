import { Router } from "express";
import { userRegister } from "./user.controller.js";
const router = Router();
router.route("/register").post(userRegister)
export default router;