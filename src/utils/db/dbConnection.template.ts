import dotenv from "dotenv";
dotenv.config();

// This is a template file for the database connection configuration.
// 1) Change the name to dbConnection.ts.
// 2) Replace the values with your own database configuration

export const mssqlConfig = {
  database: "YOUR_DATABASE_NAME",
  port: 1433,
  user: "YOUR_DB_USERNAME",
  password: "YOUR_DB_PASSWORD",
  server: "localhost",
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000,
  },
  options: {
    encrypt: true,
    trustServerCertificate: true,
  },
};
