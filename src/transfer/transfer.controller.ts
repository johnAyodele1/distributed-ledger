import { Request, Response } from "express";
import { transferMoney } from "./transfer.services";

export async function createTransfer(req: Request, res: Response) {
  const { requestId, toWallet, fromWallet, amount } = req.body;
  if (!requestId || !toWallet || !fromWallet || !amount) {
    return res.status(400).json({
      status: "fail",
      message: "Incomplete Data ",
    });
  }
  try {
    const result = await transferMoney({
      requestId,
      toWallet,
      fromWallet,

      amount,
    });
    res.status(201).json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: "fail", message: "Internal server error" });
  }
}
