import { NextFunction, Request, Response } from "express"
import { userServices } from "../services/userServices.js";
import { IBodyRequestAuth } from "../types/types.js";
import { IUserReturnTypes } from "../types/userTypes.js";



class AuthController {
    async registration(req: Request, res: Response, next: NextFunction) {
        try {
            const body: IBodyRequestAuth = req.body
            const userData: IUserReturnTypes = await userServices.createUser(body.email, body.password)
            res.cookie("refreshToken", userData.tokens.refreshToken, { httpOnly: true, maxAge: 3600 * 60 * 60 })
        }
        catch (e: any) {
            console.log(e);
        }

    }
    login(req: Request, res: Response, next: NextFunction) {
        try {

        }
        catch (e: any) {
            console.log(e);
        }

    }
    refresh(req: Request, res: Response, next: NextFunction) {
        try {

        }
        catch (e: any) {
            console.log(e);
        }

    }

}
export let authController = new AuthController();