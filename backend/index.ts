import express, { Request, Response } from "express";
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";

const app = express();
app.use(express.json());

const PORT = 5000;

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Hello World API',
            version: '1.0.0',
            description: 'Simple Hello World API with Swagger',
        },
        servers: [{ url: `http://localhost:${PORT}` }],
    },
    apis: ['./src/router/*.ts']
};

const swaggerSpec = swaggerJsdoc(options);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

/**
 * @swagger
 * /:
 *   get:
 *     summary: Hello world
 *     responses:
 *       200:
 *         description: Returns Hello World message
 */
app.get('/', (_req: Request, res: Response) => {
    res.send("Hello World!");
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`Swagger UI available at http://localhost:${PORT}/api-docs`);
});
