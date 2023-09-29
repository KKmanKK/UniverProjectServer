import { NextFunction, Request, Response } from "express"
import { userServices } from "../services/userServices.js";
import { IBodyRequestAuth } from "../types/types.js";
import { IUserReturnTypes } from "../types/userTypes.js";
import logger from "../utils/logger.js"
import { CreateUserInput } from "../schema/user.schema.js";


class AuthController {
    async registration(req: Request<{}, {}, CreateUserInput["body"]>, res: Response) {
        try {

            const userData: IUserReturnTypes = await userServices.createUser(req.body.email, req.body.password)
            res.cookie("refreshToken", userData.tokens.refreshToken, { httpOnly: true, maxAge: 3600 * 60 * 60 })
            return res.status(200).json(userData)
        }
        catch (e: any) {
            logger.error(e);
            return res.status(409).send(e.message)
        }

    }
    async login(req: Request, res: Response) {
        try {
            const body: IBodyRequestAuth = req.body
            const userData: IUserReturnTypes = await userServices.getUser(body.email, body.password)
            res.cookie("refreshToken", userData.tokens.refreshToken, { httpOnly: true, maxAge: 3600 * 60 * 60 * 60 })
            return res.status(200).json(userData)
        }
        catch (e: any) {
            logger.error(e);
            return res.status(409)
        }

    }
    async logout(req: Request, res: Response) {
        try {

            await userServices.logout(req.cookies.refreshToken)
            res.clearCookie("refreshToken")
            return res.status(200).json("")
        }
        catch (e: any) {
            logger.error(e);
            return res.status(409)
        }

    }
    async refresh(req: Request, res: Response) {
        try {
            const userData = await userServices.refresh(req.cookies.refreshToken)
            res.cookie("refreshToken", userData.tokens.refreshToken, { httpOnly: true, maxAge: 3600 * 60 * 60 * 60 })
            return res.status(200).json(userData)
        }
        catch (e: any) {
            logger.error(e);
            return res.status(409)
        }

    }

}
export let authController = new AuthController();