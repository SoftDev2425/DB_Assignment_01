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

export const getTotalEmissionsByCity = async (city: string) => {
  try {
    await sql.connect(mssqlConfig);
    const result = await sql.query`EXEC GetTotalEmissionByCity @CityName = ${city};`;
    return result.recordset;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }  
};

export const getContriesMostProminentGasses = async () => {
  try {
    await sql.connect(mssqlConfig);
    const result = await sql.query`EXEC GetGassesByCountry;`;
    return result.recordset;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }  
};

export const getTotalEmissionsForRegions = async () => {
  try {
    await sql.connect(mssqlConfig);
    const result = await sql.query`EXEC GetTotalEmissionsForRegions;`;
    return result.recordset;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}
