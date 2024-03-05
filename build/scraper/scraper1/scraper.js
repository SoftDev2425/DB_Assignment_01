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
const scraper1 = (con) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => {
        const path = "./data/2016_Cities_Emissions_Reduction_Targets_20240207.csv";
        const records = [];
        const parser = (0, csv_parse_1.parse)({
            delimiter: ",",
            from_line: 2,
        });
        fs_1.default.createReadStream(path)
            .pipe(parser)
            .on("data", (data) => {
            const obj = {};
            const organisation = {
                name: data[0].trim(),
                accountNo: parseInt(data[1]) || null,
            };
            const country = {
                name: data[2].trim(),
            };
            const city = {
                name: data[3].trim(),
                C40Status: data[4].trim() == "C40" ? true : false,
            };
            const target = {
                reportingYear: isNaN(parseInt(data[5])) ? null : parseInt(data[5]),
                baselineYear: isNaN(parseInt(data[8])) ? null : parseInt(data[8]),
                baselineEmissionsCO2: isNaN(parseInt(data[9])) ? null : parseInt(data[9]),
                reductionTargetPercentage: isNaN(parseInt(data[10])) ? null : parseInt(data[10]),
                targetYear: isNaN(parseInt(data[11])) ? null : parseInt(data[11]),
                comment: data[12].trim(),
                sector: data[6].trim(),
            };
            obj.organisation = organisation;
            obj.country = country;
            obj.city = city;
            obj.target = target;
            records.push(obj);
        })
            .on("end", () => __awaiter(void 0, void 0, void 0, function* () {
            console.log("Read all records in csv", path, "// Rows:", records.length);
            console.log("Inserting records into database...");
            try {
                for (const record of records) {
                    // NOTE: We are well aware that the transactions below can be done in a single transaction - we separated them for clarity
                    const newCountry = yield con.query `
          IF NOT EXISTS (SELECT 1 FROM Countries WHERE name = ${record.country.name})
          BEGIN
              INSERT INTO Countries (name)
              VALUES (${record.country.name});
          END
          `;
                    const newCity = yield con.query `
          IF NOT EXISTS (SELECT 1 FROM Cities WHERE name = ${record.city.name})
          BEGIN
              DECLARE @country_id uniqueidentifier;

              SELECT @country_id = id FROM Countries WHERE name = ${record.country.name};

              IF @country_id IS NOT NULL
              BEGIN
                INSERT INTO Cities (name, C40Status, countryID)
                VALUES (${record.city.name}, ${record.city.C40Status == true ? 1 : 0}, @country_id)
              END
          END
          `;
                    // create organisation
                    const newOrganisation = yield con.query `
              IF NOT EXISTS (SELECT 1 FROM Organisations WHERE accountNo = ${record.organisation.accountNo})
              BEGIN
                  DECLARE @city_id uniqueidentifier;
                  DECLARE @country_id uniqueidentifier;

                  SELECT @city_id = id FROM Cities WHERE name = ${record.city.name};
                  SELECT @country_id = id FROM Countries WHERE name = ${record.country.name};

                  IF @country_id IS NOT NULL AND @city_id IS NOT NULL
                  BEGIN
                    INSERT INTO Organisations (name, accountNo, countryID, cityID)
                    VALUES (${record.organisation.name}, ${record.organisation.accountNo}, @country_id, @city_id)
                  END
              END
              `;
                    const newSector = yield con.query `
              IF NOT EXISTS (SELECT 1 FROM Sectors WHERE name = ${record.target.sector})
              BEGIN
                  INSERT INTO Sectors (name)
                  VALUES (${record.target.sector})
              END
          `;
                    // create target
                    const newTarget = yield con.query `
            BEGIN
                DECLARE @organisation_id uniqueidentifier;
                DECLARE @sector_id uniqueidentifier;

                SELECT @organisation_id = id FROM Organisations WHERE accountNo = ${record.organisation.accountNo};
                SELECT @sector_id = id FROM Sectors WHERE name = ${record.target.sector};

                IF @organisation_id IS NOT NULL AND @sector_id IS NOT NULL
                BEGIN
                  INSERT INTO Targets (reportingYear, baselineYear, baselineEmissionsCO2, reductionTargetPercentage, targetYear, comment, organisationID, sectorID)
                  VALUES (${record.target.reportingYear}, ${record.target.baselineYear}, ${record.target.baselineEmissionsCO2}, ${record.target.reductionTargetPercentage}, ${record.target.targetYear}, ${record.target.comment}, @organisation_id, @sector_id)
                END
            END
            `;
                }
                console.log("Scraper 1 done!");
                resolve("Scraper 1 done!");
            }
            catch (error) {
                reject(error);
            }
        }));
    });
});
exports.default = scraper1;
