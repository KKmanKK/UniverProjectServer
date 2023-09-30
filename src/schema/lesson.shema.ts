import { TypeOf, object, string } from "zod";

const payload = {
    body: object({
        name: string({
            required_error: "Name is required"
        }),
        text: string({
            required_error: "Text is required"
        }),
    })
}
const params = {
    params: object({
        id: string({
            required_error: "lessonId is required"
        })
    })
}
export const createLessonSchema = object({
    ...payload
})

export const getByIdLessonSchema = object({
    ...params
})

export type CreateLessonSchema = TypeOf<typeof createLessonSchema>
export type GetByIdLessonSchema = TypeOf<typeof getByIdLessonSchema>