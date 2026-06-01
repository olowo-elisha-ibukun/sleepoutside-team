import ExternalServices from './ExternalServices.mjs';

const CATEGORIES = ['tents', 'backpacks', 'sleeping-bags'];

export default class ProductData {
  constructor(category = 'tents') {
    this.category = this.normalizeCategory(category);
    this.externalServices = new ExternalServices();
  }

  async getData(category = this.category) {
    const normalizedCategory = this.normalizeCategory(category);

    try {
      return await this.externalServices.getData(normalizedCategory);
    } catch (error) {
      console.warn(`Remote data load failed for ${normalizedCategory}. Falling back to local JSON.`, error);
      return await this.loadLocalData(normalizedCategory);
    }
  }

  async findProductById(id) {
    try {
      return await this.externalServices.findProductById(id);
    } catch (error) {
      console.warn(`Remote product load failed for ${id}. Falling back to local JSON.`, error);
      return await this.findLocalProductById(id);
    }
  }

  normalizeCategory(category) {
    if (!category) {
      return 'tents';
    }

    const normalized = category.toString().toLowerCase();
    return CATEGORIES.includes(normalized) ? normalized : 'tents';
  }

  async loadLocalData(category) {
    const localUrl = new URL(`../json/${category}.json`, import.meta.url).href;
    const response = await fetch(localUrl);

    if (!response.ok) {
      throw new Error(`Unable to load local data for category: ${category}`);
    }

    return await response.json();
  }

  async findLocalProductById(id) {
    const productId = id?.toString();

    for (const category of CATEGORIES) {
      const products = await this.loadLocalData(category);
      const product = products.find((item) => item.Id?.toString() === productId);

      if (product) {
        return product;
      }
    }

    return null;
  }
}
