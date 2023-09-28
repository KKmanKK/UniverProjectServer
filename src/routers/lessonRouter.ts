import { Router } from 'express'
import { lessonCotroller } from '../controllers/lessonController.js'

const router: Router = Router()

router.get("/lesson", lessonCotroller.getLessons)
router.post("/lesson", lessonCotroller.createLessons)
router.get("/lesson/:id", lessonCotroller.getLessonById)
export default router