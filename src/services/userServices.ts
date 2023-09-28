import { PrismaClient } from '@prisma/client'
import bcrypt from "bcrypt"
import { tokenServices } from './tokenServices.js'
import { IUser, IUserReturnTypes, IUserServices } from '../types/userTypes.js'
const prisma = new PrismaClient()

class UserServices implements IUserServices {
    //метод для создания пользователя возвращающий объект с данными пользователя и токены его 
    async createUser(email: string, password: string): Promise<IUserReturnTypes> {
        const psevdUser: IUser | null = await prisma.user.findFirst({ where: { email } }) //получаем пользователя из базы данных по его почте
        if (psevdUser) {
            throw new Error("Пользователь уже существует")
        }
        const hashPass = await bcrypt.hash(password, 4); //хэшируем пароль (передаем ему сам пароль и уровень хэширования)
        const user = await prisma.user.create({ data: { email, passord: hashPass } }) //создаем пользователя 
        const tokens = tokenServices.genirateToken({ userId: user.id }) //вызываем функцию для генирации токенов и передаем в нее индитификатор пользователя
        await tokenServices.saveToken(user.id, tokens.refreshToken) //вызываем функцию для сохранения токена и передаем ему индитификатор пользователя и рефреш токен
        return {
            user,
            tokens
        }
    }
    //метод для получения пользователя
    async getUser(email: string, password: string): Promise<IUserReturnTypes> {
        const user: IUser | null = await prisma.user.findFirst({ where: { email } })//получаем пользователя из базы данных по его почте
        if (!user) {
            throw new Error("Email не верен")
        }
        const hashPass = bcrypt.compareSync(password, user.passord)//проверка хэша пароля из базы данных с паролем, который передали в функцию
        if (!hashPass) {
            throw new Error("Password не верен")
        }
        const tokens = tokenServices.genirateToken({ userId: user.id }) //вызываем функцию для генирации токенов и передаем в нее индитификатор пользователя
        await tokenServices.saveToken(user.id, tokens.refreshToken) //вызываем функцию для сохранения токена и передаем ему индитификатор пользователя и рефреш токен
        return {
            user,
            tokens
        }
    }
    //метод для выхода из учетной записи
    async logout(refreshToken: string) {
        await tokenServices.removeToken(refreshToken) //вызываем функцию для удаления рефреш токена
        return
    }
    //функция для обновления токенов у пользователя
    async refresh(refreshToken: string): Promise<IUserReturnTypes> {

        if (!refreshToken) {
            throw new Error("Токена нету")
        }
        const userData = await tokenServices.validateRefreshToken(refreshToken) //вызываем функцию для валидации токена
        const tokenDb = await tokenServices.findToken(userData.userId) //вызываем функцию для нахождения токена по идитификатору пользователя

        if (!userData || !tokenDb) {
            throw new Error("Токена нету")
        }

        const user: IUser | null = await prisma.user.findFirst({ where: { id: userData.userId } }) //получаем пользователя из базы данных по его идитификатору

        if (!user) {
            throw new Error("Пользователь не найден")
        }

        const tokens = tokenServices.genirateToken({ userId: user.id })//вызываем функцию для генирации токенов и передаем в нее индитификатор пользователя

        await tokenServices.saveToken(user.id, tokens.refreshToken)//вызываем функцию для сохранения токена и передаем ему индитификатор пользователя и рефреш токен
        return {
            user,
            tokens
        }

    }


}
export let userServices = new UserServices();