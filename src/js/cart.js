import { getLocalStorage } from './utils.mjs';

function renderCartContents() {
  // Get cart items from local storage, if none get an empty array
  const cartItems = getLocalStorage('so-cart') || [];
  const list = document.querySelector('.product-list');
  // Check if cart is empty
  if (!cartItems.length) {
    list.innerHTML = `<li class="empty">Your cart is empty.</li>`;
    return;
  }

  const htmlItems = cartItems.map(cartItemTemplate);
  list.innerHTML = htmlItems.join('');
}

function cartItemTemplate(item) {
  const qty = item.quantity ?? 1;
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
