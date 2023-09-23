import { Router } from "express";
import { authController } from "../controllers/authController.js";

let router: Router = Router();

router.post("/singup", authController.registration)
router.post("/login", authController.login)
router.get("/logout", authController.logout)
router.get("/refresh")


export default router
