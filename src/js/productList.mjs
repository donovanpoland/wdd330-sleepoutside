import { renderListWithTemplate } from './utils.mjs';

function productCardTemplate(product) {
  return `<li class="product-card">
    <a href="../product_pages/?product=${product.Id}">
      <img src="${product.Images.PrimaryMedium || product.Image }" alt="Image of ${product.Name || ''}">
      <h2 class="card__brand">${product.Brand?.Name || ''}</h2>
      <h3 class="card__name">${product.NameWithoutBrand || product.Name || ''}</h3>
      <p class="product-card__price">$${product.FinalPrice?.toFixed(2) || product.ListPrice?.toFixed(2) || 'N/A'}</p>
    </a>
  </li>`;
}

export default class ProductList {
  constructor(category, dataSource, listElement) {
    this.category = category;
    this.dataSource = dataSource;
    this.listElement = listElement;
    this.products = [];
  }

  async init() {
    const list = await this.dataSource.getData(this.category);
    this.renderList(list);
    document.querySelector(".title").textContent = this.category;
  }

  render() {
    if (!this.products.length) {
      this.listElement.innerHTML = "<p>No products found.</p>";
      return;
    }

    const productsToRender = this.filterProducts();
    this.renderList(productsToRender);
  }

  renderList(products) {
    renderListWithTemplate(productCardTemplate, this.listElement, products);
  }

  filterProducts() {
    // Filter by category, assuming 'this.category' corresponds to a property in product
    // For example, maybe product.Category or product.Type or product.Brand.Name or whatever you have
    
    if (!this.category) return this.products;

    // Adjust the condition here to match your product's category property
    return this.products.filter(product => {
      // Example: check if product.Id includes category string (adjust as needed)
      // Or check a dedicated category property if exists
      // return product.Category === this.category;

      return true;
    });
  }
}
