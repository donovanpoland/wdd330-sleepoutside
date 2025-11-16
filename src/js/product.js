
import {getParam } from "./utils.mjs";
import ProductData from "./ProductData.mjs";
import ProductDetails from "./ProductDetails.mjs";

const productId = getParam("product");
const dataSource = new ProductData("tents");

const product = new ProductDetails(productId, dataSource);
product.init();
function addProductToCart(product) {
  // Get cart items from local storage, normalize to array
  let cartItems = getLocalStorage("so-cart") || [];
  if (!Array.isArray(cartItems)) {
    cartItems = cartItems ? [cartItems] : [];
  }

  // Push a copy of the product so cart state stays immutable
  cartItems.push({ ...product });

  // Update local storage/cart
  setLocalStorage("so-cart", cartItems);
}

export function removeProductFromCart(product) {
  // Get cart items from local storage, normalize to array
  let cartItems = getLocalStorage("so-cart") || [];

  const index = cartItems.findIndex((item) => item.Id === product.Id);
  if (index !== -1) {
    cartItems.splice(index, 1);
    setLocalStorage("so-cart", cartItems);
  }

  // Update local storage/cart
  setLocalStorage("so-cart", cartItems);
}

// add to cart button event handler
async function addToCartHandler(e) {
  const product = await dataSource.findProductById(e.target.dataset.id);
  addProductToCart(product);
}

// add listener to Add to Cart button
const addButton = document.getElementById("addToCart");
if (addButton) {
  document
    .getElementById("addToCart")
    .addEventListener("click", addToCartHandler);
}
