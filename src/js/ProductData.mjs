const baseURL = import.meta.env.VITE_SERVER_URL;

export default class ProductData {
  async getData(category) {
    const url = `${baseURL}products/search/${category}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Unable to load product data: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data.Result;
  }

  async findProductById(id) {
    const url = `${baseURL}product/${id}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Unable to load product: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data.Result;
  }
}

