const cheerio = require("cheerio");
const fetch = require("node-fetch");

const getKolonialLink = (href) => {
  return "https://kolonial.no" + href;
};

const getSubCategories = async (e) => {
  const response = await fetch(e.link);
  const html = await response.text();
  const $ = cheerio.load(html);

  const navPills = $(".nav.nav-pills a");
  const subCategories = [];

  navPills.each((i, el) => {
    const title = $(el).text().trim();
    const link = getKolonialLink($(el).attr("href"));

    subCategories.push({ title, link });
  });

  return { ...e, subCategories };
};

const getProducts = async (e) => {
  const response = await fetch(e.link);
  const html = await response.text();

  const $ = cheerio.load(html);

  const productCategoryList = $(".product-category-list.ws-xs a");

  const products = [];
  productCategoryList.each((i, el) => {
    const title = $(el).find("h3").children().first().text().trim();
    const price = $(el).find(".price.label.label-price").text().trim();
    products.push({ title, price });
  });

  return { ...e, products };
};

const mainProductCategories = fetch("https://kolonial.no/produkter")
  .then((res) => res.text())
  .then((html) => {
    const $ = cheerio.load(html);

    const kolonialSidebar = $(".filter-sidebar a");

    const mainProductCategories = [];

    kolonialSidebar.each((i, el) => {
      const link = getKolonialLink($(el).attr("href"));
      const title = $(el).text().replace(/Ny!/, "").trim();
      mainProductCategories.push({ title, link });
    });

    return mainProductCategories;
  });

const mainProductCategoriesWithSubCategories = mainProductCategories.then(
  async (cat) => {
    return Promise.all(cat.map((e) => getSubCategories(e)));
  }
);

mainProductCategoriesWithSubCategories
  .then((cat) => {
    console.log("duklartedet", cat[3]);
    return Promise.all(cat[3].subCategories.map((e) => getProducts(e)));
  })
  .then((res) => console.log(res[0]));

const getAllProducts = async () => {
  const mainProductCategories = fetch("https://kolonial.no/produkter")
    .then((res) => res.text())
    .then((html) => {
      const $ = cheerio.load(html);

      const kolonialSidebar = $(".filter-sidebar a");

      const mainProductCategories = [];

      kolonialSidebar.each((i, el) => {
        const link = getKolonialLink($(el).attr("href"));
        const title = $(el).text().replace(/Ny!/, "").trim();
        mainProductCategories.push({ title, link });
      });

      return mainProductCategories;
    });

  const mainProductCategoriesWithSubCategories = mainProductCategories.then(
    async (cat) => {
      return Promise.all(cat.map((e) => getSubCategories(e)));
    }
  );

  return mainProductCategoriesWithSubCategories.then((cat) => {
    console.log("duklartedet", cat[3]);
    return Promise.all(cat[3].subCategories.map((e) => getProducts(e)));
  });
};

export default getAllProducts;
