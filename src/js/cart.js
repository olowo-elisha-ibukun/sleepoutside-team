import { getLocalStorage } from './utils.mjs';

function renderCartContents() {
  let cartItems = getLocalStorage('so-cart');

  if (!Array.isArray(cartItems)) {
    cartItems = cartItems && typeof cartItems === 'object' ? [cartItems] : [];
  }

  const listElement = document.querySelector('.product-list');
  if (!listElement) {
    console.warn('Cart page does not contain .product-list');
    return;
  }

  const htmlItems = cartItems.map((item) => cartItemTemplate(item));
  listElement.innerHTML = htmlItems.join('');
  renderCartSummary(cartItems);
}

function cartItemTemplate(item) {
  const imageSrc = item.Images?.PrimaryMedium ?? item.Images?.PrimaryLarge ?? item.Image ?? '';
  const itemName = item.Name ?? item.NameWithoutBrand ?? 'Cart item';
  const itemColor = item.Colors?.[0]?.ColorName ?? 'N/A';
  const itemPrice = Number(item.FinalPrice ?? item.ListPrice ?? 0).toFixed(2);
  const itemQty = item.quantity ?? 1;

  return `
    <li class="cart-card divider">
      <a href="#" class="cart-card__image">
        <img src="${imageSrc}" alt="${itemName}" />
      </a>
      <a href="#">
        <h2 class="card__name">${itemName}</h2>
      </a>
      <p class="cart-card__color">${itemColor}</p>
      <p class="cart-card__quantity">qty: ${itemQty}</p>
      <p class="cart-card__price">$${itemPrice}</p>
    </li>`;
}

function renderCartSummary(cartItems) {
  const summaryEl = document.querySelector('#cart-summary');
  if (!summaryEl) return;

  if (!cartItems || cartItems.length === 0) {
    summaryEl.innerHTML = '<p class="empty-cart">Your cart is empty.</p>';
    return;
  }

  const total = cartItems.reduce((sum, item) => {
    const price = Number(item.FinalPrice ?? item.ListPrice ?? 0);
    const quantity = Number(item.quantity ?? 1);
    return sum + price * quantity;
  }, 0);

  summaryEl.innerHTML = `
    <div class="cart-summary-box">
      <p class="cart-summary__total">Total: <strong>$${total.toFixed(2)}</strong></p>
      <a class="checkout-btn" href="/checkout/index.html">Checkout</a>
    </div>
  `;
}

renderCartContents();
