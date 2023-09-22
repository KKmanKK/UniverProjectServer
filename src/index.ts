import { Express } from "express"
import express from "express"
import dotenv from "dotenv"
import authRouter from "./routers/regRouter.js"
dotenv.config()
const PORT = process.env.PORT || 3000
const app: Express = express()

app.use(express.json())
app.use("/api", authRouter)

const start = () => {
    try {
        app.listen(PORT, () => { console.log("Запуск", PORT); })
    }
    catch (e: any) {
        console.log(e);
    }
}

start()