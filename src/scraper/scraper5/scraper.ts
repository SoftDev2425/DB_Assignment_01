import fs from "fs";
import { parse } from "csv-parse";

const scraper5 = async () => {
  const path = "../data/2023_Cities_Climate_Risk_and_Vulnerability_Assessments_20240207.csv";
  const records: any[] = [];

  const parser = parse({
    delimiter: ",",
  });

  fs.createReadStream(path)
    .pipe(parser)
    .on("data", (data) => {
      const obj: any = {};

      const countries = {
        name: data[2],
      };

      obj.countries = countries;

      records.push(obj);
    })
    .on("end", () => {
      console.log(records);
    });
};

export default scraper5;
