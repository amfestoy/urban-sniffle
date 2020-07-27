import React, { useEffect, useState } from "react";
import "./App.css";
import { getMainCategories, getSubCategories, getProducts } from "./scrape.js";

const App = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [mainCategories, setMainCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [products, setProducts] = useState([]);

  const [selectedCategory, setSelectedCategory] = useState();
  const [selectedSubCategory, setSelectedSubCategory] = useState();

  // get all categories from kolonial on load
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const categories = await getMainCategories();
      setMainCategories(categories);
      setIsLoading(false);
    };
    fetchData();
  }, []);

  // get all sub categories when a category is selected
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const subCategories = await getSubCategories(selectedCategory);

      setSubCategories(subCategories);
      setIsLoading(false);
    };

    // when selecting a new category sub categories and products are removed
    setSelectedSubCategory();
    setSubCategories([]);
    setProducts([]);
    if (!!selectedCategory) {
      fetchData();
    }
  }, [selectedCategory]);

  // get all products when a sub category is selected
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const products = await getProducts(selectedSubCategory);

      setProducts(products);
      setIsLoading(false);
    };

    // when selecting a sub category all products are removed
    setProducts([]);
    if (!!selectedCategory) {
      fetchData();
    }
  }, [selectedSubCategory]);

  return (
    <div className="App">
      <header className="App-header">
        <h1>Kolonial produktkatalog</h1>
        {mainCategories && (
          <ul>
            {mainCategories.map((category) => {
              const onClick = () => {
                setSelectedCategory(category);
              };

              return (
                <li>
                  <b onClick={onClick}>{category.title}</b>
                </li>
              );
            })}
          </ul>
        )}
        {subCategories && (
          <ul>
            {subCategories.map((category) => {
              const onClick = () => setSelectedSubCategory(category);
              return (
                <li>
                  <b onClick={onClick}>{category.title}</b>
                </li>
              );
            })}
          </ul>
        )}
        {products && (
          <ul>
            {products.map((product) => {
              return (
                <li>
                  {product.title}
                  {product.price}
                </li>
              );
            })}
          </ul>
        )}
        {isLoading && (
          <div>Vent et øyeblikk mens vi henter kolonial sine deilige varer</div>
        )}
      </header>
    </div>
  );
};

export default App;
