import { Express } from "express"
import express from "express"
import dotenv from "dotenv"
import authRouter from "./routers/regRouter.js"
import lesonRouter from "./routers/lessonRouter.js"
import logger from "./utils/logger.js"
import cookieParser from "cookie-parser"
import routes from "./routers/routes.js"
import swaggerDocs from "./utils/swagger.js"
dotenv.config()

const PORT = process.env.PORT || 3000 // берем порт из переменных окружения или же порт 3000

const app: Express = express() //для создания экземпляра приложения express

app.use(express.json()) //middleware для обработки данных в json формат

app.use(cookieParser()) //middleware для обработки куки


//функция для старта приложения
const start = () => {
    try {
        app.listen(PORT, () => { logger.info(`Start on port: ${PORT}`); }) // запуск сервера и прослушка порта
        routes(app)
        swaggerDocs(app, +PORT)
    }
    catch (e: any) {
        console.log(e);
    }
}

start()