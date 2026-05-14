import { setLocalStorage } from './utils.mjs';

const tentImages = Object.fromEntries(
  Object.entries(import.meta.glob('../images/tents/*', { eager: true, query: '?url' }))
    .map(([path, url]) => [path.split('/').pop(), url]),
);

export default class ProductDetails {
  constructor(productId, dataSource) {
    this.productId = productId;
    this.dataSource = dataSource;
    this.product = {};
  }

  async init() {
    this.product = await this.dataSource.findProductById(this.productId);

    if (!this.product) {
      this.renderNotFound();
      return;
    }

    this.renderProductDetails();
    document
      .getElementById('addToCart')
      .addEventListener('click', this.addToCart.bind(this));
  }

  getProductImageUrl() {
    const imageName = this.product.Image?.split('/').pop();
    return imageName ? tentImages[imageName] || this.product.Image : this.product.Image;
  }

  renderProductDetails() {
    const main = document.querySelector('main');
    main.innerHTML = `
      <div class="product-detail">
        <h2>${this.product.Brand.Name}</h2>
        <h1>${this.product.Name}</h1>
        <img class="divider" src="${this.getProductImageUrl()}" alt="${this.product.Name}" />
        <p class="product-card__price">$${this.product.FinalPrice}</p>
        <p class="product-color">Color: ${this.product.Colors[0].ColorName}</p>
        <p class="product-description">${this.product.DescriptionHtmlSimple}</p>
        <button id="addToCart">Add to Cart</button>
      </div>
    `;
  }

  renderNotFound() {
    const main = document.querySelector('main');
    main.innerHTML = `
      <div class="product-detail">
        <h1>Product not found</h1>
        <p>We couldn’t load that product. Please go back to the home page and try again.</p>
        <a href="../index.html">Back to home</a>
      </div>
    `;
  }

  addToCart() {
    setLocalStorage('so-cart', this.product);
  }
}
