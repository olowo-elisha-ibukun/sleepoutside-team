import { loadHeaderFooter, getParam } from './utils.mjs';
import ProductData from './ProductData.mjs';
import ProductList from './ProductList.mjs';

loadHeaderFooter();

const category = getParam('category');
const dataSource = new ProductData(category);
const listElement = document.querySelector('.product-list');
const productList = new ProductList(category, dataSource, listElement);

productList.init().catch((error) => {
  console.error('Product list initialization failed:', error);
  const main = document.querySelector('main');
  if (main) {
    main.innerHTML = `
      <div class="product-detail">
        <h1>Unable to load products</h1>
        <p>There was a problem loading the product list. Please try again later.</p>
      </div>
    `;
  }
});

