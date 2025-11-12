import ProductList from './ProductList.mjs';
import ProductData from './ProductData.mjs';

const dataSource = new ProductData("tents");

const listElement = document.querySelector(".product-list");

const productList = new ProductList("Tents", dataSource, listElement);

console.log("It worked!");

productList.init();