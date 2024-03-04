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
const scraper2 = (con) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => {
        const path = "./data/2017_Cities_Emissions_Reduction_Targets_20240207.csv";
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
                name: data[1].trim(),
                accountNo: parseInt(data[0]) || null,
            };
            const country = {
                name: data[3].trim(),
                regionName: data[4].trim(),
            };
            const city = {
                name: data[2].trim(),
                C40Status: data[6].trim() == "C40" ? true : false,
                population: {
                    count: parseInt(data[17]) || null,
                    year: parseInt(data[18]) || null,
                },
            };
            const targetType = {
                type: data[8].trim(),
            };
            const target = {
                reportingYear: isNaN(parseInt(data[7])) ? null : parseInt(data[7]),
                baselineYear: isNaN(parseInt(data[9])) ? null : parseInt(data[9]),
                baselineEmissionsCO2: isNaN(parseInt(data[10])) ? null : parseInt(data[10]),
                reductionTargetPercentage: isNaN(parseInt(data[12])) ? null : parseInt(data[12]),
                targetYear: isNaN(parseInt(data[13])) ? null : parseInt(data[13]),
                comment: data[16].trim(),
                sector: data[9].trim(),
            };
            obj.organisation = organisation;
            obj.country = country;
            obj.city = city;
            obj.targetType = targetType;
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
              INSERT INTO Countries (name, regionName)
              VALUES (${record.country.name}, ${record.country.regionName});
          END

          IF EXISTS (SELECT 1 FROM Countries WHERE name = ${record.country.name})
          BEGIN
              UPDATE Countries
              SET regionName = ${record.country.regionName}
              WHERE name = ${record.country.name}
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
                    const newPopulation = yield con.query `
          IF NOT EXISTS (SELECT 1 FROM Populations WHERE cityID = (SELECT id FROM Cities WHERE name = ${record.city.name}))
          BEGIN
              DECLARE @city_id uniqueidentifier;

              SELECT @city_id = id FROM Cities WHERE name = ${record.city.name};

              IF @city_id IS NOT NULL
              BEGIN
                INSERT INTO Populations (count, year, cityID)
                VALUES (${record.city.population.count}, ${record.city.population.year}, @city_id)
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
                    const newTargetType = yield con.query `
              IF NOT EXISTS (SELECT 1 FROM TargetTypes WHERE type = ${record.targetType.type})
              BEGIN
                  INSERT INTO TargetTypes (type)
                  VALUES (${record.targetType.type})
              END
          `;
                    // create target
                    const newTarget = yield con.query `
            BEGIN
                DECLARE @organisation_id uniqueidentifier;
                DECLARE @sector_id uniqueidentifier;
                DECLARE @targetType_id uniqueidentifier;

                SELECT @organisation_id = id FROM Organisations WHERE accountNo = ${record.organisation.accountNo};
                SELECT @sector_id = id FROM Sectors WHERE name = ${record.target.sector};
                SELECT @targetType_id = id FROM TargetTypes WHERE type = ${record.targetType.type};

                IF @organisation_id IS NOT NULL AND @sector_id IS NOT NULL
                BEGIN
                  INSERT INTO Targets (reportingYear, baselineYear, baselineEmissionsCO2, reductionTargetPercentage, targetYear, comment, organisationID, sectorID, targetTypeID)
                  VALUES (${record.target.reportingYear}, ${record.target.baselineYear}, ${record.target.baselineEmissionsCO2}, ${record.target.reductionTargetPercentage}, ${record.target.targetYear}, ${record.target.comment}, @organisation_id, @sector_id, @targetType_id)
                END
            END
            `;
                }
                console.log("Scraper 2 done!");
                resolve("Scraper 2 done!");
            }
            catch (error) {
                reject(error);
            }
        }));
    });
});
exports.default = scraper2;
