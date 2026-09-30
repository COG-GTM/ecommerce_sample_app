export const MAX_LINE_ITEMS = 20;
export const MAX_QUANTITY = 10;
export const MIN_UNIT_AMOUNT = 50;

const PRODUCT_ID = /^[A-Za-z0-9_-][A-Za-z0-9._-]{0,127}$/;

export class CheckoutError extends Error {
  constructor(message, statusCode = 400) {
    super(message);
    this.name = 'CheckoutError';
    this.statusCode = statusCode;
  }
}

export const parseCart = (body) => {
  if (!Array.isArray(body) || body.length === 0) {
    throw new CheckoutError('Cart must be a non-empty array.');
  }
  if (body.length > MAX_LINE_ITEMS) {
    throw new CheckoutError(`Cart cannot contain more than ${MAX_LINE_ITEMS} items.`);
  }

  const quantities = new Map();

  body.forEach((item) => {
    if (!item || typeof item !== 'object') {
      throw new CheckoutError('Invalid cart item.');
    }

    const { _id: id, quantity } = item;

    if (typeof id !== 'string' || !PRODUCT_ID.test(id) || id.startsWith('drafts.')) {
      throw new CheckoutError('Invalid product id.');
    }
    if (!Number.isInteger(quantity) || quantity < 1 || quantity > MAX_QUANTITY) {
      throw new CheckoutError(`Quantity must be an integer between 1 and ${MAX_QUANTITY}.`);
    }

    const total = (quantities.get(id) || 0) + quantity;
    if (total > MAX_QUANTITY) {
      throw new CheckoutError(`Quantity must be an integer between 1 and ${MAX_QUANTITY}.`);
    }
    quantities.set(id, total);
  });

  return Array.from(quantities, ([id, quantity]) => ({ id, quantity }));
};

export const toUnitAmount = (price) => {
  if (typeof price !== 'number' || !Number.isFinite(price) || price <= 0) return null;

  const cents = Math.round(price * 100);

  return Number.isSafeInteger(cents) && cents >= MIN_UNIT_AMOUNT ? cents : null;
};

export const buildLineItems = (cart, products, imageUrl) => {
  const productsById = new Map(products.map((product) => [product._id, product]));

  return cart.map(({ id, quantity }) => {
    const product = productsById.get(id);

    if (!product) {
      throw new CheckoutError('Cart contains an unknown product.');
    }

    const unitAmount = toUnitAmount(product.price);

    if (unitAmount === null || typeof product.name !== 'string' || product.name.trim() === '') {
      throw new CheckoutError('Cart contains a product that is not available for purchase.');
    }

    const image = Array.isArray(product.image) ? product.image[0] : undefined;

    return {
      price_data: {
        currency: 'usd',
        product_data: {
          name: product.name,
          images: image ? [imageUrl(image)] : [],
          metadata: { sanity_id: id },
        },
        unit_amount: unitAmount,
      },
      adjustable_quantity: {
        enabled: true,
        minimum: 1,
        maximum: MAX_QUANTITY,
      },
      quantity,
    };
  });
};

export const resolveSiteUrl = (headers, configuredUrl) => {
  if (configuredUrl) return configuredUrl.replace(/\/+$/, '');

  const { origin, host } = headers;

  if (!origin || !host) {
    throw new CheckoutError('Missing request origin.', 403);
  }

  let parsed;
  try {
    parsed = new URL(origin);
  } catch (err) {
    throw new CheckoutError('Invalid request origin.', 403);
  }

  if (!['http:', 'https:'].includes(parsed.protocol) || parsed.host !== host) {
    throw new CheckoutError('Cross-origin checkout requests are not allowed.', 403);
  }

  return parsed.origin;
};
