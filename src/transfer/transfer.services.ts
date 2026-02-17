import pool from "../../config/pool";
import { transcationRows } from "./types";
export async function transferMoney(params: {
  requestId: string;
  toWallet: string;
  fromWallet: string;
  amount: number;
}) {
  const client = await pool.connect();
  const { amount, fromWallet, toWallet, requestId } = params;
  try {
    await client.query("BEGIN");
    const duplicate = await client.query<transcationRows>(
      "SELECT * FROM TRANSACTIONS WHERE REQUEST_ID = $1",
      [requestId],
    );
    if (duplicate.rowCount && duplicate.rowCount > 0) {
      await client.query("ROLLBACK");
      return { status: "fail", message: "Request already processed" };
    }
    await client.query(
      "SELECT * FROM WALLET WHERE ID=$1 FOR UPDATE; SELECT * FROM WALLET WHERE ID=$2 FOR UPDATE;",
      [toWallet, fromWallet],
    );
    await client.query(
      "INSERT INTO TRANSACTION (request_id, from_wallet, to_wallet, amount) VALUES ($1, $2, $3, $4)",
      [requestId, fromWallet, toWallet, amount],
    );
  } catch (err) {
    console.log(err);
  }
}
