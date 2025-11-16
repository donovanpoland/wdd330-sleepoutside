 import { renderListWithTemplate } from './utils.mjs';
function productCardTemplate(product) {
  return `<li class="product-card">
    <a href="product_pages/?product=${product.Id}">
      <img src="${product.Image || ''}" alt="Image of ${product.Name || ''}">
      <h2 class="card__brand">${product.Brand?.Name || ''}</h2>
      <h3 class="card__name">${product.NameWithoutBrand || product.Name || ''}</h3>
      <p class="product-card__price">$${product.FinalPrice?.toFixed(2) || product.ListPrice?.toFixed(2) || 'N/A'}</p>
    </a>
  </li>`;
}


export default class ProductList {
  constructor(category, dataSource, listElement) {
    this.category = category;
    this.dataSource = dataSource; // instance of ProductData or similar
    this.listElement = listElement; // DOM element to render products into
    this.products = [];
    // this.currentFilters={}; //for active filters to be later used
    
  }

  async init() {
    try {
      this.products = await this.dataSource.getData();
      this.render();
    } catch (error) {
      console.error("Failed to load products:", error);
      this.listElement.innerHTML = "<p>Failed to load products.</p>";
    }
  }

  renderList(products) {
    // Use map to turn each product into an HTML string, then join into one big string
    const html = products.map(product => productCardTemplate(product)).join('');
    // Set the innerHTML of the container with the entire list
    this.listElement.innerHTML = html;
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
    // Later: filter logic will go here
    return this.products.slice(0, 4);
  }


}
