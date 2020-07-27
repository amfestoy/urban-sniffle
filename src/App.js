import React from "react";
import "./App.css";
import { PRODUCT_CATEGORIES } from "./productData.js";
import getAllProducts from "./scrape.js";
function App() {
  const products = getAllProducts();
  console.log(products);

  return (
    <div className="App">
      <header className="App-header">
        <h1>Kolonial produktkatalog</h1>
        <ul>
          {PRODUCT_CATEGORIES.map((category) => {
            const href = "https://kolonial.no" + category.href;
            return (
              <li>
                <a href={href}>{category.titel}</a>;
              </li>
            );
          })}
        </ul>
      </header>
    </div>
  );
}

export default App;
