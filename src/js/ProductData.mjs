export default class ProductData {
  constructor(category) {
    this.category = category;
    this.cache = null;
  }

  async loadData() {
    if (this.cache) {
      return this.cache;
    }

    const url = new URL(`../json/${this.category}.json`, import.meta.url);
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Unable to load product data: ${response.status} ${response.statusText}`);
    }

    this.cache = await response.json();
    return this.cache;
  }

  async getData() {
    return this.loadData();
  }

  async findProductById(id) {
    const products = await this.getData();
    return products.find((item) => item.Id === id);
  }
}
