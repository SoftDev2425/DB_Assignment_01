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
const fs_1 = __importDefault(require("fs"));
const csv_parse_1 = require("csv-parse");
const scraper5 = (con) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => {
        const path = "./data/2023_Cities_Climate_Risk_and_Vulnerability_Assessments_20240207.csv";
        const records = [];
        const parser = (0, csv_parse_1.parse)({
            delimiter: ",",
            from_line: 2,
        });
        fs_1.default.createReadStream(path)
            .pipe(parser)
            .on("data", (data) => {
            const obj = {};
            const objData = JSON.stringify({
                city: data[3].trim(),
                country: data[4].trim(),
                population: data[16].trim(),
                populationYear: data[17].trim(),
                yearOfPublicationOrApproval: data[12].trim(),
                CDP_Region: data[5].trim(),
                c40Status: data[6].trim() === "true" ? true : false,
                attachment: parseInt(data[9].trim()),
            });
            obj.name = data[0].trim();
            obj.organisationNo = data[1].trim();
            obj.data = objData;
            records.push(obj);
        })
            .on("end", () => __awaiter(void 0, void 0, void 0, function* () {
            console.log("Read all records in csv", path, "// Rows:", records.length);
            console.log("Inserting records into database...");
            try {
                for (const record of records) {
                    // NOTE: We are well aware that the transactions below can be done in a single transaction - we separated them for clarity
                    const addQuestionnaire = yield con.query `
            BEGIN
              DECLARE @organisationID uniqueidentifier

              SELECT @organisationID = ID FROM Organisations WHERE accountNo = ${record.organisationNo}


              IF @organisationID IS NOT NULL
              BEGIN
                INSERT INTO Questionnaires (name, organisationID, data)
                VALUES (${record.name}, @organisationID, ${record.data})
              END
            END
          `;
                }
                console.log("Scraper 5 done!");
                resolve("Scraper 5 done!");
            }
            catch (error) {
                reject(error);
            }
        }));
    });
});
exports.default = scraper5;
