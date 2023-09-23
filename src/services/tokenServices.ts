import jwt from "jsonwebtoken"
import dotenv from "dotenv"
import { createClient } from "redis"
dotenv.config()
interface IToken {
    userId: number,
    refreshToken: string
}
class TokenServices {
    private _secretAccess = process.env.ACCESS_SECRET_KEY
    private _refreshAccess = process.env.ACCESS_SECRET_KEY

    genirateToken(payload: any) {
        let accessToken: string = "";
        let refreshToken: string = "";
        if (this._secretAccess && this._refreshAccess) {
            accessToken = jwt.sign(payload, this._secretAccess, { expiresIn: "30m" })
            refreshToken = jwt.sign(payload, this._refreshAccess, { expiresIn: "15d" })
        }
        return {
            accessToken,
            refreshToken
        }
    }
    async saveToken(userId: number, refreshToken: string): Promise<any> {
        try {
            const client = createClient()
            await client.connect();
            const tokenData = await client.get(`token?userId=${userId}`)
            if (tokenData) {
                let data: IToken = JSON.parse(tokenData)
                data.refreshToken = refreshToken
                await client.set(`token? userId = ${userId}`, JSON.stringify(data))
                return
            }
            client.set(`token?userId=${userId}`, JSON.stringify({
                userId,
                refreshToken
            },))
        }
        catch (e: any) {
            console.log(e);
        }
    }
    validateAccessToken(accessToken: string) {
        try {
            let tokenData: any
            if (this._secretAccess) {
                tokenData = jwt.verify(accessToken, this._secretAccess)
            }
            return tokenData
        }
        catch (e: any) {
            return null
        }
    }
    validateRefreshToken(refreshToken: string) {
        try {
            let tokenData: any
            if (this._refreshAccess) {
                tokenData = jwt.verify(refreshToken, this._refreshAccess)
                return tokenData
            }

        }
        catch (e: any) {
            return null
        }
    }
    async removeToken(refreshToken: string) {
        const client = createClient()
        await client.connect();
        const tokenData = await client.get(`token`)
        console.log("=================");
        console.log(tokenData);
    }
}
export let tokenServices = new TokenServices();