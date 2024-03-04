"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mssqlConfig = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// This is a template file for the database connection configuration.
// 1) Change the name to dbConnection.ts.
// 2) Replace the values with your own database configuration
exports.mssqlConfig = {
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
