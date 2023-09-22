import { PrismaClient } from '@prisma/client'
import bcrypt from "bcrypt"
import { tokenServices } from './tokenServices.js'
import { IUserReturnTypes, IUserServices } from '../types/userTypes.js'
const prisma = new PrismaClient()

class UserServices implements IUserServices {
    async createUser(email: string, password: string): Promise<IUserReturnTypes> {
        const psevdUser = await prisma.user.findFirst({ where: { email } })
        if (psevdUser) {
            throw new Error("Пользователь уже существует")
        }
        const hashPass = await bcrypt.hash(password, 4);
        const user = await prisma.user.create({ data: { email, passord: hashPass } })
        const tokens = tokenServices.genirateToken(user.id)
        await tokenServices.saveToken(user.id, tokens.refreshToken)
        return {
            user,
            tokens
        }
    }

}
export let userServices = new UserServices();