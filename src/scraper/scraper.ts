import scraper1 from "./scraper1/scraper";
import scraper2 from "./scraper2/scraper";
import scraper3 from "./scraper3/scraper";
import scraper4 from "./scraper4/scraper";
import scraper5 from "./scraper5/scraper";

const scrapeAndInsertIntoDatabase = async () => {
  await scraper1();
  // await scraper2();
  // await scraper3();
  // await scraper4();
  // await scraper5();
};

scrapeAndInsertIntoDatabase();
