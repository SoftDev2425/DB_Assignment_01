import fs from "fs";
import { parse } from "csv-parse";
import { mssqlConfig } from "../../utils/db/dbConnection";
import sql from "mssql";

const scraper5 = async () => {
  return new Promise((resolve, reject) => {
    const path = "./data/2023_Cities_Climate_Risk_and_Vulnerability_Assessments_20240207.csv";

    const records: any[] = [];

    const parser = parse({
      delimiter: ",",
      from_line: 2,
    });

    fs.createReadStream(path)
      .pipe(parser)
      .on("data", (data) => {
        const obj: any = {};

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
      .on("end", async () => {
        console.log("Read all records in csv", path, "(Rows:", records.length, ")");
        console.log("Inserting records into database...");

        const con = await sql.connect(mssqlConfig);

        try {
          for (const record of records) {
            // NOTE: We are well aware that the transactions below can be done in a single transaction - we separated them for clarity

            const addQuestionnaire = await con.query`
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
        } catch (error) {
          reject(error);
        }
      });
  });
};

export default scraper5;
