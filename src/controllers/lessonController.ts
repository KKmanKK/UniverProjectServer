import { NextFunction, Request, Response } from "express";
import { lessonServices } from "../services/lessonServices.js";

class LessonCotroller {
    async createLessons(req: Request, res: Response, next: NextFunction) {
        const lessons = await lessonServices.create(req.body.text)
        return res.status(200).json(lessons)
    }
    async getLessons(req: Request, res: Response, next: NextFunction) {

        const lessons = await lessonServices.getAll()
        return res.status(200).json(lessons)
    }
    async getLessonById(req: Request, res: Response, next: NextFunction) {
        let lessonId = req.params.id

        const lessons = await lessonServices.getById(+lessonId)
        return res.status(200).json(lessons)
    }
}
export const lessonCotroller = new LessonCotroller()