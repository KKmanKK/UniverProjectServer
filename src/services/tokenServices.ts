import jwt from "jsonwebtoken"
import dotenv from "dotenv"
import { createClient } from "redis"
dotenv.config()
interface IToken {
    userId: number,
    refreshToken: string
}
class TokenServices {
    private _secretAccess = process.env.ACCESS_SECRET_KEY//поле для хранения аксесс токена из переменных окружения
    private _refreshAccess = process.env.ACCESS_SECRET_KEY //поле для хранения рефресш токена из переменных окружения

    //метод для генирации токенов и принимает в себя payload любого типа
    genirateToken(payload: any) {
        let accessToken: string = "";
        let refreshToken: string = "";
        if (this._secretAccess && this._refreshAccess) {
            accessToken = jwt.sign(payload, this._secretAccess, { expiresIn: "30m" })//создаем токен, для этого мы передаем в метод создания payload, секретный ключ и время при, когда токен закончит работать
            refreshToken = jwt.sign(payload, this._refreshAccess, { expiresIn: "15d" })//создаем токен, для этого мы передаем в метод создания payload, секретный ключ и время при, когда токен закончит работать
        }
        return {
            accessToken,
            refreshToken
        }
    }
    //метод для сохранения токена в базу данных
    async saveToken(userId: number, refreshToken: string): Promise<any> {
        try {
            const client = createClient()//создаем клиент редис
            await client.connect();//соединяемся с редис
            const tokenData = await client.get(`token?userId=${userId}`)//почаем данные из редис по индитификатору пользователя
            if (tokenData) {
                let data: IToken = JSON.parse(tokenData) // парсим json формат в объект
                data.refreshToken = refreshToken // заменяем значение токена у старого объекта на новый токен
                await client.set(`token? userId = ${userId}`, JSON.stringify(data)) // записываем данные в редис
                return
            }
            client.set(`token?userId=${userId}`, JSON.stringify({// записываем данные в редис
                userId,
                refreshToken
            },))
        }
        catch (e: any) {
            console.log(e);
        }
    }
    //метод для валидации аксесс токена
    validateAccessToken(accessToken: string) {
        try {
            let tokenData: any
            if (this._secretAccess) {
                tokenData = jwt.verify(accessToken, this._secretAccess) //используем метод для верификации (передаем туда аксесс токен и ключ)
            }
            return tokenData
        }
        catch (e: any) {
            return null
        }
    }
    //метод для валидации рефресш токена
    validateRefreshToken(refreshToken: string) {
        try {
            let tokenData: any
            if (this._refreshAccess) {
                tokenData = jwt.verify(refreshToken, this._refreshAccess) //используем метод для верификации (передаем туда рефресш токен и ключ)
                return tokenData
            }

        }
        catch (e: any) {
            return null
        }
    }
    //метод для удаления токена
    async removeToken(refreshToken: string) {
        try {
            const client = createClient()//создаем клиент редис
            await client.connect();//соединяемся с редис
            const tokenData = this.validateRefreshToken(refreshToken) //вызываем метод для валидации рефресш токена
            if (!tokenData) {
                throw new Error("Ошибка с токеном")
            }
            await client.del(`token?userId=${tokenData.userId}`)//удаляеям данные из редис по индитификатору пользователя
            return
        }
        catch (e: any) {
            console.log(e);
        }
    }
    //метод для поиска токена по индитификатору пользователя
    async findToken(userId: number) {
        const client = createClient()//создаем клиент редис
        await client.connect();//соединяемся с редис;
        const token = await client.get(`token?userId=${userId}`) //почаем данные из редис по индитификатору пользователя
        return token;
    }
}
export let tokenServices = new TokenServices();