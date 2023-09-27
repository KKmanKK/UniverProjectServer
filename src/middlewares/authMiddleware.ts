import { NextFunction, Request, Response } from "express";
import { tokenServices } from "../services/tokenServices.js";

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    try {
        const authorisationHeader = req.headers.authorization;
        if (!authorisationHeader) {
            throw new Error("")
        }
        const accessToken = authorisationHeader.split(" ")[0];
        if (!accessToken) {
            throw new Error("")
        }
        const userData = tokenServices.validateAccessToken(accessToken)
        if (!userData) {
            throw new Error("")
        }
        next()
    }
    catch (e: any) {
        console.log(e);
    }
}