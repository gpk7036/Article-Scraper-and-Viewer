const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");

puppeteer.use(StealthPlugin());

let pp = [];

const scrapeData = async (searchQuery) => {
  const browser = await puppeteer.launch({
    headless: true,
  });
  const page = await browser.newPage();

  try {
    const newa = await page.goto(`https://medium.com/search?q=react+svg`, {
      waitUntil: "networkidle0",
    });

    page.on("response", async (res) => {
      const reslut = res.url().includes("https://medium.com/_/graphql");
      if (reslut) {
        const json = await res.json();
        if (json[0]?.data?.search?.posts?.items?.length > 0) {
          pp.push(json);
        }
      }
    });

    const html = await page.evaluate((query) => {
      const element = document.querySelectorAll("[role=combobox]");

      if (element.length > 0) {
        const input = element[0];
        input.value = query + "\n";

        var event = new Event("input", {
          bubbles: true,
          cancelable: true,
        });
        input.dispatchEvent(event);

        const event1 = new KeyboardEvent("keydown", {
          key: "Enter",
          keyCode: 13,
          bubbles: true,
          cancelable: true,
        });
        input.dispatchEvent(event1);
      }

      console.log("Save element:", element);
    }, searchQuery);

    await delay(1000);
    await browser.close();
    return pp;
  } catch (error) {
    console.error('Error during scraping:', error);
  }
};

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const maindata =async(data)=>{
  pp=[];
  await scrapeData(data);
  return pp;

}
 module.exports = maindata;