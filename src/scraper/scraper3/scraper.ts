import fs from "fs";
import { parse } from "csv-parse";
import { mssqlConfig } from "../../utils/db/dbConnection";
import sql from "mssql";

const scraper3 = async () => {
  const path = "./data/2016_Citywide_GHG_Emissions_20240207.csv";

  const records: any[] = [];

  const parser = parse({
    delimiter: ",",
  });

  fs.createReadStream(path)
    .pipe(parser)
    .on("data", (data) => {
      const obj: any = {};

      const organisation = {
        name: data[1],
        accountNo: parseInt(data[0]) || null,
      };

      const country = {
        name: data[2],
      };

      const city = {
        name: data[3],
        C40Status: data[4] == "C40" ? true : false,
        population: {
          count: parseInt(data[17]) || null,
          year: parseInt(data[16]) || null,
        },
      };

      const emissionStatusTypes = {
        type: data[14] || "",
      };

      const GHG_emissions = {
        reportingYear: isNaN(parseInt(data[7])) ? null : parseInt(data[7]),
        measurementYear: isNaN(parseInt(data[9])) ? null : parseInt(data[9]),
        boundary: data[7] || "",
        methodology: data[8] || "",
        methodologyDetails: data[9] || "",
        gassesIncluded: data[10] || "",
        totalCityWideEmissionsCO2: isNaN(parseInt(data[11])) ? null : parseInt(data[11]),
        totalScope1CO2: isNaN(parseInt(data[12])) ? null : parseInt(data[12]),
        totalScope2CO2: isNaN(parseInt(data[13])) ? null : parseInt(data[13]),
        GHG_EmissionsStatus: {
          description: data[15] || "",
        },
      };

      obj.organisation = organisation;
      obj.country = country;
      obj.city = city;
      obj.emissionStatusTypes = emissionStatusTypes;
      obj.GHG_emissions = GHG_emissions;

      records.push(obj);
    })
    .on("end", async () => {
      console.log("Read all records in csv", path, "(Rows:", records.length, ")");
      console.log("Inserting records into database...");

      const con = await sql.connect(mssqlConfig);

      try {
        for (let i = 1; i < records.length; i++) {
          // NOTE: We are well aware that the transactions below can be done in a single transaction - we separated them for clarity

          const record = records[i];

          const newCountry = await con.query`
          IF NOT EXISTS (SELECT 1 FROM Countries WHERE name = ${record.country.name})
          BEGIN
              INSERT INTO Countries (name)
              VALUES (${record.country.name});
          END
          `;

          const newCity = await con.query`
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

          const newPopulation = await con.query`
          IF NOT EXISTS (SELECT 1 FROM Populations WHERE cityID = (SELECT id FROM Cities WHERE name = ${record.city.name} AND year = ${record.city.population.year}))
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
          const newOrganisation = await con.query`
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

          const newEmissionStatusType = await con.query`
              IF NOT EXISTS (SELECT 1 FROM EmissionStatusTypes WHERE type = ${record.emissionStatusTypes.type})
              BEGIN
                  INSERT INTO EmissionStatusTypes (type)
                  VALUES (${record.emissionStatusTypes.type})
              END
          `;

          // CREATES GHG_EmissionStatus AND new GHG_Emission
          const newGHG_Emission = await con.query`
              BEGIN

                DECLARE @GHG_EmissionStatus_id TABLE (Id UNIQUEIDENTIFIER);
                DECLARE @organisation_id uniqueidentifier;
                DECLARE @emissionStatusType_id uniqueidentifier;
                DECLARE @emissionStatus_id uniqueidentifier;

                SELECT @emissionStatusType_id = id FROM EmissionStatusTypes WHERE type = ${record.emissionStatusTypes.type};

                INSERT INTO GHG_EmissionStatus (description, emissionStatusTypeID)
                OUTPUT inserted.Id INTO @GHG_EmissionStatus_id
                VALUES (${record.GHG_emissions.GHG_EmissionsStatus.description}, @emissionStatusType_id);
                SELECT Id FROM @GHG_EmissionStatus_id;

                SELECT @organisation_id = id FROM Organisations WHERE accountNo = ${record.organisation.accountNo};

                IF @organisation_id IS NOT NULL AND EXISTS (SELECT 1 FROM @GHG_EmissionStatus_id)
                BEGIN
                  INSERT INTO GHG_Emissions (reportingYear, measurementYear, boundary, methodology, methodologyDetails, gassesIncluded, totalCityWideEmissionsCO2, totalScope1_CO2, totalScope2_CO2, organisationID, GHG_EmissionStatusID)
                  VALUES (${record.GHG_emissions.reportingYear}, ${record.GHG_emissions.measurementYear}, ${record.GHG_emissions.boundary}, ${record.GHG_emissions.methodology}, ${record.GHG_emissions.methodologyDetails}, ${record.GHG_emissions.gassesIncluded}, ${record.GHG_emissions.totalCityWideEmissionsCO2}, ${record.GHG_emissions.totalScope1CO2}, ${record.GHG_emissions.totalScope2CO2}, @organisation_id, @GHG_EmissionStatus_id)
                END
              END
          `;
        }

        console.log("Records inserted into database");

        await con.close();
      } catch (error) {
        console.log(error);
      }
    });
};

export default scraper3;
