import { PrismaClient } from '@prisma/client'
import bcrypt from "bcrypt"
import { tokenServices } from './tokenServices.js'
import { IUser, IUserReturnTypes, IUserServices } from '../types/userTypes.js'
const prisma = new PrismaClient()

class UserServices implements IUserServices {
    async createUser(email: string, password: string): Promise<IUserReturnTypes> {
        const psevdUser: IUser | null = await prisma.user.findFirst({ where: { email } })
        if (psevdUser) {
            throw new Error("Пользователь уже существует")
        }
        const hashPass = await bcrypt.hash(password, 4);
        const user = await prisma.user.create({ data: { email, passord: hashPass } })
        const tokens = tokenServices.genirateToken({ userId: user.id })
        await tokenServices.saveToken(user.id, tokens.refreshToken)
        return {
            user,
            tokens
        }
    }
    async getUser(email: string, password: string): Promise<IUserReturnTypes> {
        const user: IUser | null = await prisma.user.findFirst({ where: { email } })
        if (!user) {
            throw new Error("Email не верен")
        }
        const hashPass = bcrypt.compareSync(password, user.passord)
        if (!hashPass) {
            throw new Error("Password не верен")
        }
        const tokens = tokenServices.genirateToken({ userId: user.id })
        await tokenServices.saveToken(user.id, tokens.refreshToken)
        return {
            user,
            tokens
        }
    }
    async logout(refreshToken: string) {
        await tokenServices.removeToken(refreshToken)
        return
    }
    async refresh(refreshToken: string): Promise<IUserReturnTypes> {

        if (!refreshToken) {
            throw new Error("Токена нету")
        }
        const userData = await tokenServices.validateRefreshToken(refreshToken)
        const tokenDb = await tokenServices.findToken(userData.userId)
        if (!userData || !tokenDb) {
            throw new Error("Токена нету")
        }
        const user: IUser | null = await prisma.user.findFirst({ where: { id: userData.userId } })
        if (!user) {
            throw new Error("Пользователь не найден")
        }
        const tokens = tokenServices.genirateToken({ userId: user.id })
        await tokenServices.saveToken(user.id, tokens.refreshToken)
        return {
            user,
            tokens
        }

    }


}
export let userServices = new UserServices();