import fs from "fs";
import { parse } from "csv-parse";

const scraper3 = async () => {
  const path = "../data/2017_Cities_Community_Wide_Emissions.csv";

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

export default scraper3;
