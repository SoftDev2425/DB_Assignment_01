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
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const mssql_1 = __importDefault(require("mssql"));
const dbConnection_1 = require("../utils/db/dbConnection");
const scraper_1 = __importDefault(require("./scraper1/scraper"));
const scraper_2 = __importDefault(require("./scraper2/scraper"));
const scraper_3 = __importDefault(require("./scraper3/scraper"));
const scraper_4 = __importDefault(require("./scraper4/scraper"));
const scraper_5 = __importDefault(require("./scraper5/scraper"));
const scrapeAndInsertIntoDatabase = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const con = yield mssql_1.default.connect(dbConnection_1.mssqlConfig);
        yield (0, scraper_1.default)(con);
        yield (0, scraper_2.default)(con);
        yield (0, scraper_3.default)(con);
        yield (0, scraper_4.default)(con);
        yield (0, scraper_5.default)(con);
        yield con.close();
        console.log("All scrapers done! Now onto adding the stored procedures :)");
    }
    catch (error) {
        console.error("Error occurred while running scrapers:", error);
    }
});
scrapeAndInsertIntoDatabase();
