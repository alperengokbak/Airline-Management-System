// Import express and swaggerUi
import express from "express";
import swaggerUi from "swagger-ui-express";

// Import YAML file
import YAML from "yamljs";
import fs from "fs";

// Import routes
import authRoute from "./src/routes/authRoute.js";
import ticketRoute from "./src/routes/ticketRoute.js";

// Import Application Insights
import appInsights from "applicationinsights";
appInsights.setup(process.env.APPLICATIONINSIGHTS_CONNECTION_STRING).start();

// Import cors
import cors from "cors";

const app = express(); // Create an express application
const port = process.env.PORT;

app.use(express.json()); // Use JSON parsing middleware for incoming requests
app.use(cors()); // Enable CORS (Cross-Origin Resource Sharing) for the application

// Parse the Swagger YAML document into a JavaScript object
const swaggerDocument = YAML.parse(fs.readFileSync("./swagger.yml", "utf8"));

// Serve Swagger UI at "/api-docs" and set up Swagger UI with the parsed YAML document
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use("/auth", authRoute);
app.use("/ticket", ticketRoute);

app.listen(port, () => console.log(`App listening on port ${port}`));
