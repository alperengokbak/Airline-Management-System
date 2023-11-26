// Import express and swaggerUi
import express from "express";
import swaggerUi from "swagger-ui-express";

// Import YAML file
import YAML from "yamljs";
import fs from "fs";

// Import routes
import authRoute from "./src/routes/authRoute.js";
import ticketRoute from "./src/routes/ticketRoute.js";

// Import cors
import cors from "cors";

const app = express();
const port = process.env.PORT || 4000;

app.use(express.json());
app.use(cors());

const swaggerDocument = YAML.parse(fs.readFileSync("./swagger.yml", "utf8"));
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use("/auth", authRoute);
app.use("/ticket", ticketRoute);

app.listen(port, () => console.log(`App listening on port ${port}`));
