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
      const imageSrc = product.Images?.PrimaryMedium ?? product.Image ?? '';
      const brandName = product.Brand?.Name ?? '';
      const productName = product.Name ?? product.NameWithoutBrand ?? '';
      const productPrice = product.FinalPrice ?? product.ListPrice ?? 0;

      return `
        <li class="product-card">
          <a href="../product_pages/index.html?product=${product.Id}">
            <img src="${imageSrc}" alt="${productName}" />
            <h3 class="card__brand">${brandName}</h3>
            <h2 class="card__name">${productName}</h2>
            <p class="product-card__price">$${productPrice}</p>
          </a>
        </li>
      `;
    }).join('');

    this.listElement.innerHTML = productHTML;
  }
}
