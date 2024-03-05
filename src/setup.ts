import fs from "fs";
import sql from "mssql";
import { mssqlConfig } from "./utils/db/dbConnection";
import scraper1 from "./scraper/scraper1/scraper";
import scraper2 from "./scraper/scraper2/scraper";
import scraper3 from "./scraper/scraper3/scraper";
import scraper4 from "./scraper/scraper4/scraper";
import scraper5 from "./scraper/scraper5/scraper";

const setup = async () => {
  var tableScript = fs.readFileSync("../sql/tables.sql").toString();
  var sp1 = fs.readFileSync("../sql/procedures/1.sql").toString();
  var sp2 = fs.readFileSync("../sql/procedures/2.sql").toString();
  var sp3 = fs.readFileSync("../sql/procedures/3.sql").toString();
  var sp4 = fs.readFileSync("../sql/procedures/4.sql").toString();
  var sp5 = fs.readFileSync("../sql/procedures/5.sql").toString();
  //   var sp6 = fs.readFileSync("../sql/procedures/6.sql").toString();
  var sp7 = fs.readFileSync("../sql/procedures/7.sql").toString();
  var sp8 = fs.readFileSync("../sql/procedures/8.sql").toString();
  var sp9 = fs.readFileSync("../sql/procedures/9.sql").toString();
  var sp10 = fs.readFileSync("../sql/procedures/10.sql").toString();

  // CREATE DB TABLES
  const con = await sql.connect(mssqlConfig);
  
  await con.query(tableScript);
  
  console.log("Tables created");

  // CREATE DB STORED PROCEDURES

  await con.query(sp1),
  await con.query(sp2),
  await con.query(sp3),
  await con.query(sp4),
  await con.query(sp5),
  await con.query(sp7),
  await con.query(sp8),
  await con.query(sp9),
  await con.query(sp10),
  
  console.log("Procedures created");
  
  // ADD DATA TO DB
  
  await scraper1(con);
  await scraper2(con);
  await scraper3(con);
  await scraper4(con);
  await scraper5(con);

  console.log("Scrappers run successfully");
  
  // CLOSE CONNECTION
  await con.close();
  console.log("Setup finished");
};

setup();
