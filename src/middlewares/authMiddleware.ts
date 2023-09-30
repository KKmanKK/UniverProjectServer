import { NextFunction, Request, Response } from "express";
import { tokenServices } from "../services/tokenServices.js";
import logger from "../utils/logger.js"
export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    try {
        const authorisationHeader = req.headers.authorization;
        if (!authorisationHeader) {
            throw new Error("Неавторизованный")
        }
        const accessToken = authorisationHeader.split(" ")[0];
        if (!accessToken) {
            throw new Error("Неавторизованный")
        }
        const userData = tokenServices.validateAccessToken(accessToken)
        if (!userData) {
            throw new Error("Неавторизованный")
        }
        next()
    }
    catch (e: any) {
        logger.error(e);
    }
}