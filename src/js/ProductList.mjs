import { renderWithTemplate } from './utils.mjs';

export default class ProductList {
  constructor(category, dataSource, listElement) {
    this.category = category;
    this.dataSource = dataSource;
    this.listElement = listElement;
    this.products = [];
  }

  async init() {
    this.products = await this.dataSource.getData(this.category);
    this.renderList();
  }

  renderList() {
    // Create header with dynamic category
    const categoryDisplay = this.category.charAt(0).toUpperCase() + this.category.slice(1).replace('-', ' ');
    const headerHTML = `<h2>Top Products: ${categoryDisplay}</h2>`;
    
    // Insert header before the list
    this.listElement.insertAdjacentHTML('beforebegin', headerHTML);

    // Render product items
    const productHTML = this.products.map((product) => {
      return `
        <li class="product-card">
          <a href="../product_pages/index.html?product=${product.Id}">
            <img src="${product.Images.PrimaryMedium}" alt="${product.Name}" />
            <h3 class="card__brand">${product.Brand.Name}</h3>
            <h2 class="card__name">${product.Name}</h2>
            <p class="product-card__price">$${product.FinalPrice}</p>
          </a>
        </li>
      `;
    }).join('');

    this.listElement.innerHTML = productHTML;
  }
}
