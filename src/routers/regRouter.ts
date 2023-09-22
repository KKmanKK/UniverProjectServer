import { Router } from "express";
import { authController } from "../controllers/authController.js";

let router: Router = Router();

router.post("/singup", authController.registration)
router.post("/login")
router.post("/logout")
router.post("/refresh")


export default router
