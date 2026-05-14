import tents from '../json/tents.json' assert { type: 'json' };

const dataSources = {
  tents,
};

export default class ProductData {
  constructor(category) {
    this.category = category;
  }

  getData() {
    return Promise.resolve(dataSources[this.category] ?? []);
  }

  async findProductById(id) {
    const products = await this.getData();
    return products.find((item) => item.Id === id);
  }
}
