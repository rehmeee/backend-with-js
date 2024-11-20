import {Router} from "express"
import {genrateTokens, rigesterUser, userLogin, userLougout} from "./user.controller.js"
import { upload } from "./multer.middleware.js"
import {authMiddleWare} from "./auth.middlerware.js"
const router = Router()

router.route("/register").post(upload.fields([{name: "avtar",
    maxCount: 1},{name: "coverImage", maxCount: 1
}]),rigesterUser)

router.route("/login").post(userLogin)
router.route("/tokens").post(genrateTokens)
router.route("/logout").post(authMiddleWare,userLougout)


export default router