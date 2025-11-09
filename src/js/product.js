import { setLocalStorage, getLocalStorage } from "./utils.mjs";
import ProductData from "./ProductData.mjs";

const dataSource = new ProductData("tents");

function addProductToCart(product) {
  // Get cart items from local storage, if none get an empty array
  let cartItems = getLocalStorage("so-cart") || [];
  // Convert to array
  if (!Array.isArray(cartItems)) {
    if (cartItems) {
      cartItems = [cartItems];
    } else {
      cartItems = [];
    }
  }
  // Update array with cart items
  cartItems.push(product);
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
