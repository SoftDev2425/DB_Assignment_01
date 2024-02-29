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

      records.forEach(async (record) => {

        // create country
        const newCountry = await con.query`INSERT INTO Countries (name) VALUES (${record.country.name})`;

        // create city --> add countryId if exists
        const newCity = await con.query`INSERT INTO Cities (name, C40Status, countryId) VALUES (${
          record.city.name
        }, ${record.city.C40Status}, ${newCountry.recordset[0].id}) 
        SELECT ${record.city.name}
        WHERE NOT EXISTS (
          SELECT 1 FROM Cities WHERE name = ${record.city.name}
        )`;

        // create organisation
          const newOrganisation = await con.query`
            INSERT INTO Organsations (name, accountNo, cityID, countryID) VALUES (${record.organisation.name}, ${record.organisation.accountNo}, ${newCity.recordset[0].id}, ${newCountry.recordset[0].id}) 
            SELECT ${record.organisation.accountNo}
            WHERE NOT EXISTS (
              SELECT 1 FROM Organisations WHERE accountNo = ${record.organisation.accountNo}
            )`;
          `

        // create target --> add cityId, organizationId if exists
              


    });
    await con.close();

});

export default scraper1;
