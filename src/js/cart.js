import { getLocalStorage } from "./utils.mjs";

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
      src='${item.Image}'
      alt='${item.Name}'
    />
  </a>
  <a href='#'>
    <h2 class='card__name'>${item.Name}</h2>
  </a>
  <p class='cart-card__color'>${item.Colors[0].ColorName}</p>
  <p class='cart-card__quantity'>qty: ${qty}</p>
  <p class='cart-card__price'>$${(item.FinalPrice * qty).toFixed(2)}</p>
</li>`;

  return newItem;
}

renderCartContents();
