const request = require("request");
const cheerio = require("cheerio");
request("https://kolonial.no/produkter", (error, response, html) => {
  if (!error && response.statusCode === 200) {
    const $ = cheerio.load(html);

    const kolonialSidebar = $(".filter-sidebar a");

    const productCategories = [];

    kolonialSidebar.each((i, el) => {
      const href = $(el).attr("href");
      const titel = $(el).text().replace(/Ny!/, "").trim();
      productCategories.push({ titel, href });
    });

    console.log(productCategories);
  }
});
