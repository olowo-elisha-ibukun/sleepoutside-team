import { getParam, loadHeaderFooter } from './utils.mjs';
import ExternalServices from './ExternalServices.mjs';
import ProductDetails from './ProductDetails.mjs';

function initProductPage() {
  loadHeaderFooter();
  const productId = getParam('product');
  const dataSource = new ExternalServices();
  const product = new ProductDetails(productId, dataSource);

  if (!productId) {
    product.renderNotFound();
    return;
  }

  product.init().catch((error) => {
    console.error('Product page initialization failed:', error);
    const main = document.querySelector('main');
    if (main) {
      main.innerHTML = `
        <div class="product-detail">
          <h1>Unable to load product</h1>
          <p>There was an error loading this product. Please try again later.</p>
          <a href="../index.html">Back to home</a>
        </div>
      `;
    }
  });
}

document.addEventListener('DOMContentLoaded', initProductPage);
