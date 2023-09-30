import { TypeOf, object, string } from "zod";

export const createUserSchema = object({
    body: object({
        email: string({
            required_error: "Email is required"
        }).email("Not a valid email"),
        password: string({
            required_error: "Password is required"
        }).min(4, "Password too short - should be 4 chars min")
    })
})

export const loginUserSchem = object({
    body: object({
        email: string({
            required_error: "Email is required"
        }).email("Not a valid email"),
        password: string({
            required_error: "Password is required"
        }).min(4, "Password too short - should be 4 chars min")
    })
})
export type CreateUserInput = TypeOf<typeof createUserSchema>
export type LoginUserInut = TypeOf<typeof loginUserSchem>