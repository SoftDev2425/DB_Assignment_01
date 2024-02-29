import fs from "fs";
import { parse } from "csv-parse";

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

      const organization = {
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

      obj.organization = organization;
      obj.country = country;
      obj.city = city;
      obj.target = target;

      records.push(obj);

      // read countries from the csv file and insert to database

      // read cities from the csv file and insert to database

      // read organizations from the csv file and insert to database
    })
    .on("end", () => {
      console.log("Read all records in csv", records.length);
      console.log(records[1]);
    });
};

export default scraper1;
