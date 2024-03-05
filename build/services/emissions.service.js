"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.tester = void 0;
const dbConnection_1 = require("../utils/db/dbConnection");
const mssql_1 = __importDefault(require("mssql"));
const tester = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("REACHED");
        yield mssql_1.default.connect(dbConnection_1.mssqlConfig);
        const result = yield mssql_1.default.query `SELECT * FROM Accounts;`;
        console.log(result.recordset[0]);
        return result.recordset;
    }
    catch (error) {
        console.error("Error:", error);
        throw error;
    }
});
exports.tester = tester;
