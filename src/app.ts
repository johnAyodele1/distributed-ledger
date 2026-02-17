import express, { Express } from "express";
import transferRoute from "./transfer/transfer.routes";
const app: Express = express();

app.use(express.json());

app.use("/api/transfer", transferRoute);

export default app;
