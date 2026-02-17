import express, { Express } from "express";
const router = express.Router();
import { createTransfer } from "./transfer.controller";

router.post("/transfer", createTransfer);
export default router;
