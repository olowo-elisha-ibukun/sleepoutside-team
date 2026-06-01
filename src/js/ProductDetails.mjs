import { setLocalStorage } from './utils.mjs';

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

  renderProductDetails() {
    const main = document.querySelector('main');
    const description = (this.product.DescriptionHtmlSimple ?? '').replace(/<a[^>]*>(.*?)<\/a>/gi, '$1');
    const imageUrl = this.product.Images?.PrimaryLarge ?? this.product.Image ?? '';
    const brandName = this.product.Brand?.Name ?? '';
    const productName = this.product.Name ?? this.product.NameWithoutBrand ?? '';
    const colorName = this.product.Colors?.[0]?.ColorName ?? 'N/A';
    const productPrice = this.product.FinalPrice ?? this.product.ListPrice ?? 0;

    main.innerHTML = `
      <div class="product-detail">
        <h2>${brandName}</h2>
        <h1>${productName}</h1>
        <img class="divider" src="${imageUrl}" alt="${productName}" />
        <p class="product-card__price">$${productPrice}</p>
        <p class="product-color">Color: ${colorName}</p>
        <p class="product-description">${description}</p>
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
    const existingCart = JSON.parse(localStorage.getItem('so-cart'));
    const cartItems = Array.isArray(existingCart) ? existingCart : [];
    cartItems.push(this.product);
    localStorage.setItem('so-cart', JSON.stringify(cartItems));
    window.location.href = '../cart/index.html';
  }
}
