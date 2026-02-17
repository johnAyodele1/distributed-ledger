import pool from "../../config/pool";
import { param, userType, walletType } from "./types";

export async function createUser(params: param) {
  const client = await pool.connect();
  const { firstName, lastName, gender, passwordHash, country, curreny, email } =
    params;
  try {
    await client.query("BEGIN");
    const user = await client.query<userType>(
      "INSERT INTO USERS (FIRST_NAME, LAST_NAME, GENDER, PASSWORD_HASH, COUNTRY, EMAIL) VALUES ($1 , $2, $3, $4,$5, $6) RETURNING ID, FIRST_NAME, LAST_NAME,EMAIL, GENDER,COUNTRY",
      [firstName, lastName, gender, passwordHash, country, email],
    );
    const id = user.rows[0].id;
    const wallet = await client.query<walletType>(
      "INSERT INTO WALLETS (USER_ID, CURRENCY) VALUES ($1, $2) RETURNING ID ,BALANCE",
      [id, curreny],
    );

    await client.query("COMMIT");
    return { status: "Success", user: user.rows[0], wallet: wallet.rows[0] };
  } catch (err) {
    console.log(err);
    if (client) await client.query("ROLLBACK");

    return { status: "Fail", message: "An error Occured" };
  } finally {
    if (client) client.release();
  }
}
