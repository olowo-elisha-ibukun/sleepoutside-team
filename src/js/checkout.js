import CheckoutProcess from './CheckoutProcess.mjs';

function initCheckoutPage() {
  const checkoutProcess = new CheckoutProcess('so-cart', '#order-summary');
  checkoutProcess.init();
  checkoutProcess.calculateOrderTotal();

  let form = document.querySelector('form.checkout-form');
  if (!form) {
    form = document.querySelector('form');
    if (form) {
      console.warn('Checkout page did not find form.checkout-form; using fallback form selector.');
    }
  }

  const zipInput = document.querySelector('#zip');

  const refreshTotals = () => {
    checkoutProcess.calculateOrderTotal();
  };

  if (zipInput) {
    zipInput.addEventListener('blur', refreshTotals);
    zipInput.addEventListener('change', refreshTotals);
    zipInput.addEventListener('input', refreshTotals);
  } else {
    console.warn('Checkout page could not find ZIP code input with #zip');
  }

  if (!form) {
    console.error('Checkout page could not find the checkout form with selector form.checkout-form or form');
    return;
  }

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const formElement = event.currentTarget;

    console.log('Checkout submit event fired');

    try {
      const result = await checkoutProcess.checkout(formElement);
      console.log('Checkout successful', result);
      localStorage.removeItem('so-cart');
      alert('Your order has been placed successfully!');
      form.reset();
      checkoutProcess.init();
    } catch (error) {
      console.error('Checkout submission failed:', error);
      const message = error instanceof Error ? error.message : String(error);
      alert(`Checkout failed: ${message}`);
    }
  });
}

document.addEventListener('DOMContentLoaded', initCheckoutPage);
