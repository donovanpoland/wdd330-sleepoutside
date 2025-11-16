import { getLocalStorage, loadHeaderFooter } from "./utils.mjs";
import { removeProductFromCart } from "./product.js";
import ProductData from "./ProductData.mjs";

const dataSource = new ProductData("tents");


const list = document.querySelector(".product-list");
// Get cart footer on page
const footer = document.querySelector(".cart-footer");
// Get element for placing total
const totalElement = document.querySelector(".cart-total");
// Add event listener to add to cart buttons
list.addEventListener("click", removeButtonClick);

function renderCartContents() {
  // Get cart items from local storage, normalize to array
  let cartItems = getLocalStorage("so-cart") || [];
  if (!Array.isArray(cartItems)) {
    cartItems = cartItems ? [cartItems] : [];
  }

  // AQUI VER JSON VERIFICAR
  // SEE JSON HERE, VERIFY
  //console.log("CART ITEMS RAW:", cartItems);

  // If cart is empty display message
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

  // Convertir a array para calcular total
  // Convert to array to calculate total
  const groupedArray = [...groupedItems.values()];

  // Display cart using template
  const htmlItems = groupedArray.map(cartItemTemplate);
  list.innerHTML = htmlItems.join("");

  // Calcular el total del carrito
  // Calculate the cart total.
  const total = groupedArray.reduce(
    (sum, item) => sum + item.FinalPrice * item.qty,
    0,
  );

  // <-- ACTUALIZA EL TOTAL
  // <-- UPDATE THE TOTAL
  updateCartTotal(total);
}

function cartItemTemplate(item) {
  const qty = item.qty;
  const newItem = `<li class="cart-card divider">
  <a href="#" class="cart-card__image">
     <img
      src="${item.Image}"
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
// function to remove the product from the cart.
async function removeButtonClick(event) {
  if (!event.target.matches("button#remove")) return;

  const productId = event.target.dataset.id;
  const product = await dataSource.findProductById(productId);
  if (!product) return;

    if (product) {
      removeProductFromCart(product);
      // vuelve a pintar el carrito
      // re-render the cart.
      renderCartContents();
    }
  }


function updateCartTotal(total) {
  if (!footer || !totalElement) {
    // Si no existen elementos, solo logueamos
    // If there aren’t any elements, we just log it
    //console.log("Total (no footer in DOM):", total.toFixed(2));
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

loadHeaderFooter();
renderCartContents();
