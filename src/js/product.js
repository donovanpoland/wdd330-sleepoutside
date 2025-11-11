
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
  // Check for duplicates update quantity
  // Searches the cart array for an entry whose Id matches the product being added. The result is the index of that item
  const uniqueItem = cartItems.findIndex((item) => item.Id === product.Id);
  if (uniqueItem >= 0) {
    // Set default quantity
    let currentQty = 1;
    if (typeof cartItems[uniqueItem].quantity === "number") {
      currentQty = cartItems[uniqueItem].quantity;
    }
    cartItems[uniqueItem].quantity = currentQty + 1;
  } else {
    // Make a new empty object
    const productForCart = {};

    // Copy all properties from product into the new object
    for (let key in product) {
      productForCart[key] = product[key];
    }

    // Add a new property
    productForCart.quantity = 1;

    // Update array with cart items
    cartItems.push(productForCart);
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
