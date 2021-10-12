import express from "express";
import * as http from "http";
import * as bodyparser from "body-parser";
import * as winston from "winston";
import cors from "cors";
import debug from "debug";
import * as dotenv from "dotenv";
import compression from "compression";
import expressWinston from "express-winston";

dotenv.config();
const app: express.Application = express();
const server: http.Server = http.createServer(app);
const port = 3000;
const debugLog: debug.IDebugger = debug("app");

app.use(bodyparser.json());
app.use(cors());
app.use(compression());

app.use(
  expressWinston.logger({
    transports: [new winston.transports.Console()],
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.json(),
    ),
    meta: true, // optional: control whether you want to log the meta data about the request (default to true)
    msg: "HTTP {{req.method}} {{req.url}}", // optional: customize the default logging message. E.g. "{{res.statusCode}} {{req.method}} {{res.responseTime}}ms {{req.url}}"
    expressFormat: true, // Use the default Express/morgan request formatting. Enabling this will override any msg if true. Will only output colors with colorize set to true
    colorize: false, // Color the text and status code, using the Express/morgan color palette (text: gray, status: default green, 3XX cyan, 4XX yellow, 5XX red).
    ignoreRoute: function (_req, _res) {
      return false;
    }, // optional: allows to skip some log messages based on request and/or response
  }),
);

app.get("/", (_req: express.Request, res: express.Response) => {
  res.status(200).send(`Server running at http://localhost:${port}`);
});
server.listen(port, () => {
  debugLog(`Server running at http://localhost:${port}`);
});
