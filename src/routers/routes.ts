import { Express } from "express";
import { authController } from "../controllers/authController.js";
import validate from "../middlewares/validatateResource.js";
import { createUserSchema, loginUserSchem } from "../schema/user.schema.js";
import { createLessonSchema, getByIdLessonSchema } from "../schema/lesson.shema.js";
import { lessonCotroller } from "../controllers/lessonController.js";

function routes(app: Express) {
    app.post("/api/singup", validate(createUserSchema), authController.registration)
    app.post("/api/login", validate(loginUserSchem), authController.login)
    app.get("/api/logout", authController.logout)
    app.get("/api/refresh", authController.refresh)

    app.post("/api/lesson", validate(createLessonSchema), lessonCotroller.createLessons)
    app.get("/api/lesson", lessonCotroller.getLessons)
    app.get("/api/lesson:id", validate(getByIdLessonSchema), lessonCotroller.getLessonById)
}

export default routes