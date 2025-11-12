import { getLocalStorage, setLocalStorage, loadHeaderFooter } from "./utils.mjs";
import { removeProductFromCart } from "./product";
import ProductData from "./ProductData.mjs";

const dataSource = new ProductData("tents");

const list = document.querySelector(".product-list");
list.addEventListener("click", removeButtonClick);

loadHeaderFooter();

function renderCartContents() {
  // Get cart items from local storage, normalize to array
  let cartItems = getLocalStorage("so-cart") || [];
  if (!Array.isArray(cartItems)) {
    cartItems = cartItems ? [cartItems] : [];
  }

  const list = document.querySelector(".product-list");

  if (!cartItems.length) {
    list.innerHTML = `<li class="empty">Your cart is empty.</li>`;
    return;
  }

  // Group identical products and track quantities
  const groupedItems = cartItems.reduce((map, item) => {
    const existing = map.get(item.Id);
    if (existing) {
      existing.qty += 1;
    } else {
      map.set(item.Id, { ...item, qty: 1 });
    }
    return map;
  }, new Map());

  const htmlItems = [...groupedItems.values()].map(cartItemTemplate);
  list.innerHTML = htmlItems.join("");
}

function cartItemTemplate(item) {
  const qty = item.qty;
  const newItem = `<li class='cart-card divider'>
  <a href='#' class='cart-card__image'>
    <img
      src="${item.Image}"
      alt="${item.Name}"
    />
  </a>
  <a href="#">
    <h2 class="card__name">${item.Name}</h2>
  </a>
  <p class='cart-card__color'>${item.Colors[0].ColorName}</p>
  <p class='cart-card__quantity'>qty: ${qty}</p>
  <p class='cart-card__price'>$${(item.FinalPrice * qty).toFixed(2)}</p>
</li>`;

  return newItem;
}

async function removeButtonClick(event) {
  if (!event.target.matches("button#remove")) return;

  const productId = event.target.dataset.id;
  const product = await dataSource.findProductById(productId);
  if (!product) return;

  removeProductFromCart(product);
  renderCartContents();
}

export function removeProductFromCart(product) {
  let cartItems = getLocalStorage('so-cart') || [];

  // Remove all items with matching product.Id
  cartItems = cartItems.filter(item => item.Id !== product.Id);

  setLocalStorage('so-cart', cartItems);
}

renderCartContents();
