import fs from "fs";
import { parse } from "csv-parse";
import { mssqlConfig } from "../../utils/db/dbConnection";
import sql from "mssql";

const scraper1 = async () => {
  const path = "../data/2016_Cities_Emissions_Reduction_Targets_20240207.csv";

  const records: any[] = [];

  const parser = parse({
    delimiter: ",",
  });

  fs.createReadStream(path)
    .pipe(parser)
    .on("data", (data) => {
      const obj: any = {};

      const organisation = {
        name: data[0],
        accountNo: data[1],
      };

      const country = {
        name: data[2],
      };

      const city = {
        name: data[3],
        C40Status: data[4] == "C40" ? true : false,
      };

      const target = {
        reportingYear: isNaN(parseInt(data[5])) ? null : parseInt(data[5]),
        baselineYear: isNaN(parseInt(data[8])) ? null : parseInt(data[8]),
        baselineEmissionsCO2: isNaN(parseInt(data[9])) ? null : parseInt(data[9]),
        reductionTargetPercentage: isNaN(parseInt(data[10])) ? null : parseInt(data[10]),
        targetYear: isNaN(parseInt(data[11])) ? null : parseInt(data[11]),
        comment: data[12],
        sector: data[6],
      };

      obj.organisation = organisation;
      obj.country = country;
      obj.city = city;
      obj.target = target;

      records.push(obj);
    })
    .on("end", async () => {
      console.log("Read all records in csv", records.length);

      const con = await sql.connect(mssqlConfig);

      try {
        for (const record of records) {
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

          //   // create organisation
          //   const newOrganisation = await con.query`
          //     IF NOT EXISTS (SELECT 1 FROM Organisations WHERE accountNo = ${record.organisation.accountNo})
          //     BEGIN
          //         INSERT INTO Organisations (name, accountNo, cityID, countryID)
          //         VALUES (${record.organisation.name}, ${record.organisation.accountNo}, ${newCity.recordset[0].id}, ${newCountry.recordset[0].id})
          //     END
          //     `;

          //   const newSector = await con.query`
          //     IF NOT EXISTS (SELECT 1 FROM Sectors WHERE name = ${record.target.sector})
          //     BEGIN
          //         INSERT INTO Sectors (name)
          //         VALUES (${record.target.sector})
          //     END
          // `;

          //   // create target
          //   const newTarget = await con.query`
          //   BEGIN
          //     INSERT INTO Targets (reportingYear, baselineYear, baselineEmissionsCO2, reductionTargetPercentage, targetYear, comment, cityID, organisationID, sectorID)
          //     VALUES (${record.target.reportingYear}, ${record.target.baselineYear}, ${record.target.baselineEmissionsCO2}, ${record.target.reductionTargetPercentage}, ${record.target.targetYear}, ${record.target.comment}, ${newCity.recordset[0].id}, ${newOrganisation.recordset[0].id}, ${newSector.recordset[0].id})
          //   END
          //   `;
        }
      } catch (error) {
        console.log(error);
      }

      await con.close();
    });
};

export default scraper1;
