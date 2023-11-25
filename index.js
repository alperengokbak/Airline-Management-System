// Import express and swaggerUi
import express from "express";
import swaggerUi from "swagger-ui-express";

// Import YAML file
import YAML from "yamljs";
import fs from "fs";

// Import routes
import authRoute from "./src/routes/authRoute.js";
import ticketRoute from "./src/routes/ticketRoute.js";

// Import body-parser and cors
import bodyParser from "body-parser";
import cors from "cors";

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.json());
app.use(cors());

const swaggerDocument = YAML.parse(fs.readFileSync("/Users/alperengokbak/vsCode/se4458-Midterm/swagger.yaml", "utf8"));
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use("/auth", authRoute);
app.use("/ticket", ticketRoute);

app.listen(port, () => console.log(`App listening on port ${port}`));
