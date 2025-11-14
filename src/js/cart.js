import { getLocalStorage } from "./utils.mjs";
import { removeProductFromCart } from "./product.js";
import ProductData from "./ProductData.mjs";

const dataSource = new ProductData("tents");

const list = document.querySelector(".product-list");

const footer = document.querySelector(".cart-footer");  //total cart
const totalElement = document.querySelector(".cart-total"); //total cart

list.addEventListener("click", removeButtonClick);

function renderCartContents() {
  // Get cart items from local storage, normalize to array
  let cartItems = getLocalStorage("so-cart") || [];
  if (!Array.isArray(cartItems)) {
    cartItems = cartItems ? [cartItems] : [];
  }

  console.log("CART ITEMS RAW:", cartItems); // <-- AQUI VER JSON VERIFICAR

  const list = document.querySelector(".product-list");

  if (!cartItems.length) {
    list.innerHTML = `<li class="empty">Your cart is empty.</li>`;
    updateCartTotal(0);
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

  // --- NUEVO: convertir a array para calcular total ---
  const groupedArray = [...groupedItems.values()];

  // Display cart using template
  const htmlItems = groupedArray.map(cartItemTemplate);
  list.innerHTML = htmlItems.join("");

  // --- NUEVO: calcular el total del carrito ---
  const total = groupedArray.reduce(
    (sum, item) => sum + item.FinalPrice * item.qty,
    0
  );

  updateCartTotal(total);  // <-- ACTUALIZA EL TOTAL
}

function cartItemTemplate(item) {
  const qty = item.qty;

  const fixedImagePath = `../public${item.Image}`;  // ruta de la imagen corregida
  const newItem = `<li class="cart-card divider">
  <a href="#" class="cart-card__image">
     <img
      src="${fixedImagePath}"
      alt="${item.Name}"
    />
  </a>
  <a href="#">
    <h2 class="card__name">${item.Name}</h2>
  </a>
  <p class="cart-card__color">${item.Colors[0].ColorName}</p>
  <p class="cart-card__quantity">qty: ${qty}</p>
  <p class="cart-card__price">$${(item.FinalPrice * qty).toFixed(2)}</p>
  <button id="remove" data-id="${item.Id}">❌</button>
</li>`;

  return newItem;
}

// funcion para eliminar el producto del carrito
function removeButtonClick(event) {
  if (event.target && event.target.id === "remove") {
    const productId = event.target.dataset.id;

    // buscar el producto completo en el carrito
    const cartItems = getLocalStorage("so-cart") || [];
    const productToRemove = cartItems.find((item) => item.Id == productId);

    if (productToRemove) {
      removeProductFromCart(productToRemove);
      renderCartContents(); // ← vuelve a pintar el carrito
    }
  }
}

function updateCartTotal(total) {
  if (!footer || !totalElement) {
    // Si no existen elementos, solo logueamos
    console.log("Total (no footer en DOM):", total.toFixed(2));
    return;
  }

  if (total <= 0) {
    footer.classList.add("hide");
    totalElement.textContent = `Total: $0.00`;
    return;
  }

  footer.classList.remove("hide");
  totalElement.textContent = `Total: $${total.toFixed(2)}`;
}

renderCartContents();
