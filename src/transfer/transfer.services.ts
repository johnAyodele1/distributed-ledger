import pool from "../../config/pool";
import { v4 as uuid } from "uuid";
import { param, returnBody, transactionRows } from "./types";
export async function transferMoney(params: param): Promise<returnBody> {
  const client = await pool.connect();
  const { amount, fromWallet, toWallet, requestId } = params;
  try {
    const transcation_id = uuid();
    await client.query("BEGIN");
    const duplicate = await client.query<transactionRows>(
      "SELECT * FROM TRANSACTIONS WHERE REQUEST_ID = $1",
      [requestId],
    );
    if (duplicate.rowCount && duplicate.rowCount > 0) {
      await client.query("ROLLBACK");
      return { status: "Success", message: duplicate.rows[0].id };
    }
    const wallets = [fromWallet, toWallet].sort();
    await client.query("SELECT * FROM wallets WHERE id = ANY($1) FOR UPDATE", [
      wallets,
    ]);
    await client.query(
      "INSERT INTO TRANSACTIONS (request_id, from_wallet, to_wallet, amount, id) VALUES ($1, $2, $3, $4, $5)",
      [requestId, fromWallet, toWallet, amount, transcation_id],
    );
    const updateResult = await client.query(
      "UPDATE WALLETS SET BALANCE=BALANCE - $1 WHERE ID=$2 AND BALANCE >= $1",
      [amount, fromWallet],
    );
    if (updateResult.rowCount === 0) {
      await client.query("ROLLBACK");
      return { status: "Fail", message: "Insufficient balance" };
    }
    await client.query(
      "INSERT INTO LEDGER (wallet_id,transcation_id,amount, entry_type ) VALUES ($1,$2, $3, 'Debit')",
      [fromWallet, transcation_id, amount],
    );
    await client.query("UPDATE WALLETS SET BALANCE=BALANCE + $1 WHERE ID=$2", [
      amount,
      toWallet,
    ]);
    await client.query(
      "INSERT INTO LEDGER (wallet_id,transcation_id,amount, entry_type ) VALUES ($1,$2, $3, 'Credit')",
      [toWallet, transcation_id, amount],
    );
    await client.query(
      "UPDATE TRANSACTIONS SET STATUS_TRANSCATION ='Success' WHERE REQUEST_ID =$1",
      [requestId],
    );
    await client.query("COMMIT");
    return { status: "Success", message: transcation_id };
  } catch (err) {
    console.log(err);
    if (client) {
      await client.query("ROLLBACK");
    }
    return { status: "Fail", message: "Transaction fail" };
  } finally {
    if (client) client.release();
  }
}
