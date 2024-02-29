import dotenv from "dotenv";
dotenv.config();

export const mssqlConfig = {
  database: "DB_Assignment_1",
  port: 1433,
  user: "sa",
  password: "StrongPassword123!",
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
