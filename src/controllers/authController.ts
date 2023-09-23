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
            return res.status(200).json(userData)
        }
        catch (e: any) {
            console.log(e);
        }

    }
    async login(req: Request, res: Response, next: NextFunction) {
        try {
            const body: IBodyRequestAuth = req.body
            const userData: IUserReturnTypes = await userServices.getUser(body.email, body.password)
            res.cookie("refreshToken", userData.tokens.refreshToken, { httpOnly: true, maxAge: 3600 * 60 * 60 * 60 })
            return res.status(200).json(userData)
        }
        catch (e: any) {
            console.log(e);
        }

    }
    async logout(req: Request, res: Response, next: NextFunction) {
        try {
            console.log("======");
            console.log(req.cookies);
            console.log("==============");
            await userServices.logout(req.cookies.refreshToken)
            res.clearCookie("refreshToken")
            return res.status(200)
        }
        catch (e: any) {
            console.log(e);
        }

    }
    async refresh(req: Request, res: Response, next: NextFunction) {
        try {

        }
        catch (e: any) {
            console.log(e);
        }

    }

}
export let authController = new AuthController();