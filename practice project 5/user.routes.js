import {Router} from "express"
import {rigesterUser} from "./user.controller.js"
import { upload } from "./multer.middleware.js"
const router = Router()

router.route("/register").post(upload.fields([{name: "avtar",
    maxCount: 1},{name: "coverImage", maxCount: 1
}]),rigesterUser)

export default router