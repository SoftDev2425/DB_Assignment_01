import { mssqlConfig } from "../utils/db/dbConnection";
import sql from "mssql";

export const tester = async () => {
  try {
    console.log("REACHED");
    await sql.connect(mssqlConfig);
    const result = await sql.query`SELECT * FROM Accounts;`;
    console.log(result.recordset[0]);
    return result.recordset;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};
