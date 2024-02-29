import dotenv from "dotenv";
dotenv.config();

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
