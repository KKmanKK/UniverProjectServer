import { Express } from "express";
import { authController } from "../controllers/authController";
import validate from "../middlewares/validatateResource";
import { createUserSchema } from "../schema/user.schema";
function routes(app: Express) {
    app.post("/singup", validate(createUserSchema), authController.registration)
    app.post("/login", authController.login)
    app.get("/logout", authController.logout)
    app.get("/refresh")
}

export default routes