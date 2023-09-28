import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
interface ILeson {
    id: number;
    text: string;
    speed?: number;
    accuracy?: number;
    time?: number;
    userId?: number | null;
}
class LessonServices {
    async create(text: string) {
        const lessons = await prisma.lesson.create({ data: { text } })
        if (!lessons) {
            throw new Error("Не удалось создать урок")
        }
        return lessons
    }

    async getAll() {
        const lessons = await prisma.lesson.findMany();
        if (!lessons) {
            throw new Error("Уроков нету")
        }
        return lessons
    }

    async getById(lessonId: number) {
        const lesson = await prisma.lesson.findFirst({ where: { id: lessonId } });

        if (!lesson) {
            throw new Error("Уроков нету")
        }
        return lesson
    }
}
export const lessonServices = new LessonServices()