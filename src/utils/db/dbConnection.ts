import dotenv from "dotenv";

dotenv.config();

export const mssqlConfig = {
  database: "DB_assignment_1",
  port: Number(process.env.DB_PORT),
  user: "sa", // should be in .env
  password: "StrongPassword123!", // should be in .env
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
