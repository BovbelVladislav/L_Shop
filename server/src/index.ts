import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import router from "./router/router";
import swaggerUi from "swagger-ui-express"; 
import swaggerJsdoc from "swagger-jsdoc";


const app = express();

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "L_Shop API",
      version: "1.0.0",
      description: "Документация API для магазина L_Shop",
    },
    servers: [{ url: "http://localhost:5000/api" }],
  },
  apis: ["./src/router/*.ts", "./src/controllers/**/*.ts"], 
};

const specs = swaggerJsdoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.use("/api", router);

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
  console.log(`Swagger docs at http://localhost:${PORT}/api-docs`);
});
