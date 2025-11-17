import {
  getLocalStorage,
  setLocalStorage,
  loadHeaderFooter,
} from "./utils.mjs";
import ProductData from "./ProductData.mjs";

const dataSource = new ProductData("tents");

const list = document.querySelector(".product-list");
list.addEventListener("click", removeButtonClick);

loadHeaderFooter();

function renderCartContents() {
  let cartItems = getLocalStorage("so-cart") || [];
  if (!Array.isArray(cartItems)) {
    cartItems = cartItems ? [cartItems] : [];
  }

  if (!cartItems.length) {
    list.innerHTML = `<li class="empty">Your cart is empty.</li>`;
    showCartTotal([]); // show zero total
    return;
  }

  const htmlItems = cartItems.map(cartItemTemplate).join("");
  list.innerHTML = htmlItems;

  showCartTotal(cartItems);
}

function cartItemTemplate(item) {
  const qty = item.quantity || 1;

  return `
<li class="cart-card divider">
  <a href="#" class="cart-card__image">
    <img src="${item.Images.PrimaryMedium || item.Image}" alt="${item.Name}" />
  </a>

  <a href="#">
    <h2 class="card__name">${item.Name}</h2>
  </a>

  <p class="cart-card__color">${item.Colors[0].ColorName}</p>
  <p class="cart-card__quantity">qty: ${qty}</p>
  <p class="cart-card__price">$${(item.FinalPrice * qty).toFixed(2)}</p>

  <button id="remove" data-id="${item.Id}">❌</button>
</li>`;
}

async function removeButtonClick(event) {
  if (!event.target.matches("button#remove")) return;

  const productId = event.target.dataset.id;

  removeProductFromCart(productId);
  renderCartContents();
}

export function removeProductFromCart(productId) {
  let cartItems = getLocalStorage("so-cart") || [];

  const index = cartItems.findIndex((item) => item.Id === productId);

  if (index === -1) return;

  // Remove ONE at a time
  if (cartItems[index].quantity > 1) {
    cartItems[index].quantity--;
  } else {
    cartItems.splice(index, 1);
  }

  setLocalStorage("so-cart", cartItems);
}

function showCartTotal(cartItems) {
  const total = cartItems.reduce((sum, item) => {
    const qty = item.quantity || 1;
    return sum + Number(item.FinalPrice) * qty;
  }, 0);

  const formattedTotal = total.toFixed(2);

  const footer = document.querySelector(".cart-footer");
  if (footer) {
    footer.classList.remove("hide");
    footer.querySelector(".cart-total").textContent =
      `Total: $${formattedTotal}`;
  }
}

renderCartContents();
