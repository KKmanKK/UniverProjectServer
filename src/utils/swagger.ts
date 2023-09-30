import { Request, Response, Express } from "express";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express"
import { version } from "../../package.json"
import logger from "./logger.js"
const option: swaggerJSDoc.Options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Rest Api Docs",
            version
        },
        components: {
            securitySchemas: {
                bearerAuth: {
                    type: "http",
                    schema: "bearer",
                    bearerFormat: "JWT"
                }
            }
        },
        security: [{
            bearerAuth: []
        }]
    },
    apis: ['./src/routes.ts', './src/schema/*.ts']
}
const swaggerSpec = swaggerJSDoc(option)
function swaggerDocs(app: Express, port: number) {
    app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec))
    app.get("docs.json", (req: Request, res: Response) => {
        res.setHeader("Content-Type", "application/json")
        res.send(swaggerSpec)
    })
    logger.info(`Docs available at http://localhost:${port}/docs`)
}
export default swaggerDocs