import { NextFunction, Request, Response } from "express";
import { lessonServices } from "../services/lessonServices.js";
import { CreateLessonSchema, GetByIdLessonSchema } from "../schema/lesson.shema.js";
import logger from "../utils/logger.js"

class LessonCotroller {
    async createLessons(req: Request<{}, {}, CreateLessonSchema["body"]>, res: Response, next: NextFunction) {
        try {
            const lessons = await lessonServices.create(req.body.text, req.body.name)
            return res.status(200).json(lessons)
        }
        catch (e: any) {
            logger.error(e)
            return res.status(409).send(e.message)
        }
    }
    async getLessons(req: Request, res: Response, next: NextFunction) {
        try {
            const lessons = await lessonServices.getAll()
            return res.status(200).json(lessons)
        }
        catch (e: any) {
            logger.error(e)
            return res.status(404).send(e.message)
        }

    }
    async getLessonById(req: Request<GetByIdLessonSchema["params"]>, res: Response, next: NextFunction) {
        try {
            let lessonId = req.params.id

            const lessons = await lessonServices.getById(+lessonId)
            return res.status(200).json(lessons)
        }
        catch (e: any) {
            logger.error(e)
            return res.status(404).send(e.message)
        }
    }
}
export const lessonCotroller = new LessonCotroller()