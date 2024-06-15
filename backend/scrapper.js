const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");

puppeteer.use(StealthPlugin());

let pp = [];

const openmediem = async (searchQuery) => {
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

    await delay(6000);
    await browser.close();
  } catch (error) {
    console.error('Error during scraping:', error);
  }
};

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Example usage: Pass the search query from the frontend to openmediem function
const searchQueryFromFrontend = "svg in angular js";
openmediem(searchQueryFromFrontend).then(() => {
  newfun();
});

const newfun = () => {
  console.log("Save element:", pp);
  console.log(pp[0]?.[0]?.data?.search?.posts?.items);
  console.log("Save element:", pp[1]?.[0]?.data?.search?.posts?.items);
  console.log("Save element:", pp[0]?.[0]?.data?.search?.posts?.items.length);
  console.log("Save element:", pp[1]?.[0]?.data?.search?.posts?.items.length);
  console.log("Save element:", JSON.stringify(pp[2]));
};

 module.exports = openmediem;