import { getLocalStorage } from './utils.mjs';
import ExternalServices from './ExternalServices.mjs';

function formValuesToObject(formElement) {
  const formData = new FormData(formElement);
  return Object.fromEntries(formData.entries());
}

export default class CheckoutProcess {
  constructor(key, outputSelector) {
    this.key = key;
    this.outputSelector = outputSelector;
    this.list = [];
    this.itemTotal = 0;
    this.shipping = 0;
    this.tax = 0;
    this.orderTotal = 0;
  }

  init() {
    this.list = getLocalStorage(this.key) ?? [];
    this.calculateItemSummary();
  }

  parsePrice(value) {
    if (value == null) {
      return 0;
    }

    const raw = typeof value === 'string' ? value.replace(/\$/g, '').trim() : value;
    const parsed = Number(raw);

    return Number.isNaN(parsed) ? 0 : parsed;
  }

  parseQuantity(value) {
    if (value == null || value === '') {
      return 1;
    }

    const quantity = Number(value);
    return Number.isNaN(quantity) || quantity <= 0 ? 1 : quantity;
  }

  calculateItemSummary() {
    this.itemTotal = this.list.reduce((sum, item) => {
      const price = this.parsePrice(item.price ?? item.FinalPrice ?? item.ListPrice);
      const quantity = this.parseQuantity(item.quantity);
      return sum + price * quantity;
    }, 0);

    const totalItemCount = this.list.reduce((sum, item) => {
      return sum + this.parseQuantity(item.quantity);
    }, 0);

    document.querySelector(`${this.outputSelector} #subtotal`).textContent = `$${this.itemTotal.toFixed(2)}`;

    this.calculateOrderTotal(totalItemCount);
  }

  calculateOrderTotal(totalItemCount = this.list.reduce((sum, item) => sum + item.quantity, 0)) {
    this.tax = this.itemTotal * 0.06;
    this.shipping = totalItemCount > 0 ? 10 + (totalItemCount - 1) * 2 : 0;
    this.orderTotal = this.itemTotal + this.tax + this.shipping;

    this.displayOrderTotals();
  }

  displayOrderTotals() {
    document.querySelector(`${this.outputSelector} #tax`).textContent = `$${this.tax.toFixed(2)}`;
    document.querySelector(`${this.outputSelector} #shipping`).textContent = `$${this.shipping.toFixed(2)}`;
    document.querySelector(`${this.outputSelector} #orderTotal`).textContent = `$${this.orderTotal.toFixed(2)}`;
  }

  packageItems(items) {
    return items.map((item) => ({
      id: item.Id,
      name: item.Name,
      price: item.FinalPrice,
      quantity: item.quantity
    }));
  }

  async checkout(formElement) {
    const formValues = formValuesToObject(formElement);
    const payload = {
      orderDate: new Date().toISOString(),
      fname: formValues.fname,
      lname: formValues.lname,
      firstName: formValues.fname,
      lastName: formValues.lname,
      street: formValues.street,
      city: formValues.city,
      state: formValues.state,
      zip: formValues.zip,
      cardNumber: formValues.cardNumber,
      expiration: formValues.expiration,
      code: formValues.code,
      items: this.packageItems(this.list),
      shipping: this.shipping,
      tax: this.tax,
      orderTotal: this.orderTotal
    };

    const externalServices = new ExternalServices();
    return await externalServices.checkout(payload);
  }
}
