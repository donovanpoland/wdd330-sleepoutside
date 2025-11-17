import { setLocalStorage, getLocalStorage } from "./utils.mjs";


export default class ProductDetails {
  constructor(productId, dataSource) {
    this.productId = productId;
    this.product = {};
    this.dataSource = dataSource;
  }

  async init() {
    this.product = await this.dataSource.findProductById(this.productId);
    this.renderProductDetails();
    this.addAddToCartListener();
  }


addProductToCart(product) {
    if (!product || !product.Id) {
      console.error("Invalid product:", product);
      return;
    }

    let cartItems = getLocalStorage("so-cart") || [];

    if (!Array.isArray(cartItems)) {
      if (cartItems) {
        cartItems = [cartItems];
      } else {
        cartItems = [];
      }
    }

    const uniqueItem = cartItems.findIndex((item) => item.Id === product.Id);
    if (uniqueItem >= 0) {
      let currentQty = 1;
      if (typeof cartItems[uniqueItem].quantity === "number") {
        currentQty = cartItems[uniqueItem].quantity;
      }
      cartItems[uniqueItem].quantity = currentQty + 1;
    } else {
      const productForCart = { ...product, quantity: 1 };
      cartItems.push(productForCart);
    }

    setLocalStorage("so-cart", cartItems);
}

  renderProductDetails() {
    const section = document.querySelector('.product-detail');
    if (section) {
        section.innerHTML = productDetailsTemplate(this.product);
    } else {
        console.error("No .product-detail section found");
  }
  }

  addAddToCartListener() {
  const addToCartButton = document.getElementById("addToCart");
  if (addToCartButton) {
    addToCartButton.addEventListener("click", () => {
      this.addProductToCart(this.product);
    });
  }
}


}

function productDetailsTemplate(product) {
  const hasDiscount = product.SuggestedRetailPrice > product.FinalPrice;
  const discountPercent = hasDiscount
    ? Math.round(((product.SuggestedRetailPrice - product.FinalPrice) / product.SuggestedRetailPrice) * 100)
    : 0;

  return `
    <h3>${product.Brand.Name}</h3>
    <h2 class="divider">${product.NameWithoutBrand}</h2>
    <img class="divider" src="${product.Images.PrimaryLarge || product.Image}" alt="${product.NameWithoutBrand}" />
    
    <div class="card_prices_list">
      ${hasDiscount ? `
        <p class="suggested_price">Suggested Retail Price: <span class="product-card__suggested">$${product.SuggestedRetailPrice.toFixed(2)}</span></p>
        ` : ''
      }
      
      
      <p class="our-price">You Pay: $${product.FinalPrice.toFixed(2)}</p>
      
      ${hasDiscount ? `<p class="discount">Save ${discountPercent}%!</p>` : ''}
    </div>
    
    <p class="product__color">${product.Colors[0].ColorName}</p>
    <p class="product__description">${product.DescriptionHtmlSimple}</p>
    <div class="product-detail__add">
      <button id="addToCart" data-id="${product.Id}">Add to Cart</button>
    </div>
  `;
}
