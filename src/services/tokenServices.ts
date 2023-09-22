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
    async saveToken(userId: any, refreshToken: any): Promise<any> {
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
}
export let tokenServices = new TokenServices();