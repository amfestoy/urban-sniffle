const request = require("request");
const cheerio = require("cheerio");

const getKolonialLink = (href) => {
  return "https://kolonial.no" + href;
};
request("https://kolonial.no/produkter", (error, response, html) => {
  if (!error && response.statusCode === 200) {
    const $ = cheerio.load(html);

    const kolonialSidebar = $(".filter-sidebar a");

    const mainProductCategories = [];

    kolonialSidebar.each((i, el) => {
      const href = getKolonialLink($(el).attr("href"));
      const titel = $(el).text().replace(/Ny!/, "").trim();
      mainProductCategories.push({ titel, href });
    });

    const fruktOgBær = mainProductCategories[3];
    console.log(fruktOgBær);

    request(fruktOgBær.href, (error, response, html) => {
      if (!error && response.statusCode === 200) {
        const $ = cheerio.load(html);

        const navPills = $(".nav.nav-pills a");

        const subProductCategories = [];

        navPills.each((i, el) => {
          const titel = $(el).text().trim();
          const href = getKolonialLink($(el).attr("href"));

          subProductCategories.push({ titel, href });
        });

        console.log(subProductCategories);

        const frukt = subProductCategories[0];
        console.log(frukt);
        request(frukt.href, (error, response, html) => {
          const $ = cheerio.load(html);

          const productCategoryList = $(".product-category-list.ws-xs a");

          productCategoryList.each((i, el) => {
            const title = $(el).find("h3").children().first().text();
            console.log(title);
          });
        });
      }
    });

    //console.log(mainProductCategories);
  }
});
