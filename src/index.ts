import { Express } from "express"
import express from "express"
import dotenv from "dotenv"
import authRouter from "./routers/regRouter.js"
import lesonRouter from "./routers/lessonRouter.js"

import cookieParser from "cookie-parser"
dotenv.config()

const PORT = process.env.PORT || 3000 // берем порт из переменных окружения или же порт 3000

const app: Express = express() //для создания экземпляра приложения express

app.use(express.json()) //middleware для обработки данных в json формат

app.use(cookieParser()) //middleware для обработки куки

app.use("/api", authRouter)// для маршрутизации запросов, которые будут нужны для авторизации
app.use("/", lesonRouter) // для маршрутизации запросов, которые будут относится ко всем дургим запросам
//функция для старта приложения
const start = () => {
    try {
        app.listen(PORT, () => { console.log("Запуск", PORT); }) // запуск сервера и прослушка порта
    }
    catch (e: any) {
        console.log(e);
    }
}

start()