const baseURL = import.meta.env.VITE_SERVER_URL;

export default class ExternalServices {
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

  async checkout(payload) {
    const url = 'https://wdd330-backend.onrender.com/checkout';
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const parseResponseBody = async () => {
      const text = await response.text();
      if (!text) {
        return null;
      }

      const tryParse = (value) => {
        try {
          return JSON.parse(value);
        } catch {
          return null;
        }
      };

      const trimmed = text.trim();
      const json = tryParse(trimmed);
      if (json !== null) {
        return json;
      }

      if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
        const jsonFromString = tryParse(trimmed.replace(/\uFEFF/g, ''));
        if (jsonFromString !== null) {
          return jsonFromString;
        }
      }

      return text;
    };

    const parseJSONSafe = (value) => {
      try {
        return JSON.parse(value);
      } catch {
        return null;
      }
    };

    const formatErrorBody = (body) => {
      if (!body) {
        return null;
      }

      if (typeof body === 'string') {
        const trimmed = body.trim();
        if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
          const parsed = parseJSONSafe(trimmed);
          if (parsed) {
            return formatErrorBody(parsed);
          }
        }
        return trimmed;
      }

      if (typeof body === 'object') {
        if (body.errors) {
          const errors = body.errors;
          if (Array.isArray(errors)) {
            return errors.join('; ');
          }
          if (typeof errors === 'object') {
            return Object.entries(errors).flatMap(([field, value]) => {
              if (Array.isArray(value)) {
                return value.map((item) => `${field}: ${item}`);
              }
              return `${field}: ${value}`;
            }).join('; ');
          }
          return String(errors);
        }

        if (body.message) {
          return String(body.message);
        }
        if (body.detail) {
          return String(body.detail);
        }
        if (body.error) {
          return String(body.error);
        }

        const fieldMessages = Object.entries(body).map(([field, value]) => {
          if (Array.isArray(value)) {
            return value.map((item) => `${field}: ${item}`).join('; ');
          }
          return `${field}: ${value}`;
        });

        return fieldMessages.join('; ');
      }

      return String(body);
    };

    if (!response.ok) {
      let errorMessage = `Checkout request failed: ${response.status} ${response.statusText}`;
      const responseBody = await parseResponseBody();
      const formatted = formatErrorBody(responseBody);

      if (formatted) {
        errorMessage = `${errorMessage} - ${formatted}`;
      }

      throw new Error(errorMessage);
    }

    return await response.json();
  }
}

