import { setLocalStorage } from './utils.mjs';

export default class ProductDetails {
  constructor(productId, dataSource) {
    this.productId = productId;
    this.dataSource = dataSource;
    this.product = {};
  }

  async init() {
    this.product = await this.dataSource.findProductById(this.productId);
    this.renderProductDetails();
    document
      .getElementById('addToCart')
      .addEventListener('click', this.addToCart.bind(this));
  }

  renderProductDetails() {
    const main = document.querySelector('main');
    main.innerHTML = `
      <div class="product-detail">
        <h2>${this.product.Brand.Name}</h2>
        <h1>${this.product.Name}</h1>
        <img class="divider" src="${this.product.Image}" alt="${this.product.Name}" />
        <p class="product-card__price">$${this.product.FinalPrice}</p>
        <p class="product-color">Color: ${this.product.Colors[0].ColorName}</p>
        <p class="product-description">${this.product.DescriptionHtmlSimple}</p>
        <button id="addToCart">Add to Cart</button>
      </div>
    `;
  }

  addToCart() {
    setLocalStorage('so-cart', this.product);
  }
}
