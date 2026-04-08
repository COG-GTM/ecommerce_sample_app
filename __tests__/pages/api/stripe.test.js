import handler from '../../../pages/api/stripe';

const mockCreate = jest.fn();

jest.mock('stripe', () => {
  return jest.fn(() => ({
    checkout: {
      sessions: {
        create: (...args) => mockCreate(...args),
      },
    },
  }));
});

describe('API /api/stripe', () => {
  let req;
  let res;

  beforeEach(() => {
    jest.clearAllMocks();
    req = {
      method: 'POST',
      headers: { origin: 'http://localhost:3000' },
      body: [
        {
          name: 'Headphones',
          price: 100,
          quantity: 2,
          image: [{ asset: { _ref: 'image-abc123-webp' } }],
        },
      ],
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      setHeader: jest.fn().mockReturnThis(),
      end: jest.fn().mockReturnThis(),
    };
  });

  it('should create a checkout session on POST (happy path)', async () => {
    mockCreate.mockResolvedValue({ id: 'cs_test_123', url: 'https://checkout.stripe.com/...' });

    await handler(req, res);

    expect(mockCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        submit_type: 'pay',
        mode: 'payment',
        payment_method_types: ['card'],
        billing_address_collection: 'auto',
        success_url: 'http://localhost:3000/success',
        cancel_url: 'http://localhost:3000/canceled',
      })
    );
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'cs_test_123' })
    );
  });

  it('should transform image URLs correctly', async () => {
    mockCreate.mockResolvedValue({ id: 'cs_test_123' });

    await handler(req, res);

    const callArgs = mockCreate.mock.calls[0][0];
    const lineItem = callArgs.line_items[0];
    expect(lineItem.price_data.product_data.images[0]).toBe(
      'https://cdn.sanity.io/images/vfxfwnaw/production/abc123.webp'
    );
  });

  it('should map line items with correct price and quantity', async () => {
    mockCreate.mockResolvedValue({ id: 'cs_test_123' });

    await handler(req, res);

    const callArgs = mockCreate.mock.calls[0][0];
    const lineItem = callArgs.line_items[0];
    expect(lineItem.price_data.currency).toBe('usd');
    expect(lineItem.price_data.product_data.name).toBe('Headphones');
    expect(lineItem.price_data.unit_amount).toBe(10000); // price * 100
    expect(lineItem.quantity).toBe(2);
    expect(lineItem.adjustable_quantity.enabled).toBe(true);
    expect(lineItem.adjustable_quantity.minimum).toBe(1);
  });

  it('should return 405 for non-POST methods (sad path)', async () => {
    req.method = 'GET';

    await handler(req, res);

    expect(res.setHeader).toHaveBeenCalledWith('Allow', 'POST');
    expect(res.status).toHaveBeenCalledWith(405);
    expect(res.end).toHaveBeenCalledWith('Method Not Allowed');
  });

  it('should return error status when Stripe throws (sad path)', async () => {
    const error = new Error('Invalid API Key');
    error.statusCode = 401;
    mockCreate.mockRejectedValue(error);

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith('Invalid API Key');
  });

  it('should default to 500 when Stripe error has no statusCode', async () => {
    const error = new Error('Unknown error');
    mockCreate.mockRejectedValue(error);

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith('Unknown error');
  });

  it('should handle multiple line items in the body', async () => {
    req.body = [
      {
        name: 'Headphones',
        price: 100,
        quantity: 1,
        image: [{ asset: { _ref: 'image-abc-webp' } }],
      },
      {
        name: 'Speaker',
        price: 200,
        quantity: 3,
        image: [{ asset: { _ref: 'image-def-webp' } }],
      },
    ];
    mockCreate.mockResolvedValue({ id: 'cs_test_456' });

    await handler(req, res);

    const callArgs = mockCreate.mock.calls[0][0];
    expect(callArgs.line_items).toHaveLength(2);
    expect(callArgs.line_items[1].price_data.product_data.name).toBe('Speaker');
    expect(callArgs.line_items[1].price_data.unit_amount).toBe(20000);
    expect(callArgs.line_items[1].quantity).toBe(3);
  });
});
