const mockCreate = jest.fn();

jest.mock('stripe', () => {
  return jest.fn().mockImplementation(() => ({
    checkout: {
      sessions: {
        create: mockCreate,
      },
    },
  }));
});

const handler = require('../../../pages/api/stripe').default;

describe('Stripe API Route', () => {
  let req, res;

  beforeEach(() => {
    jest.clearAllMocks();
    req = {
      method: 'POST',
      headers: { origin: 'http://localhost:3000' },
      body: [
        {
          name: 'Headphones',
          price: 250,
          quantity: 2,
          image: [{ asset: { _ref: 'image-abc123-webp' } }],
        },
      ],
    };
    res = {
      status: jest.fn(() => res),
      json: jest.fn(() => res),
      setHeader: jest.fn(() => res),
      end: jest.fn(() => res),
    };
  });

  it('creates a checkout session for POST requests', async () => {
    mockCreate.mockResolvedValueOnce({ id: 'cs_test_123' });
    await handler(req, res);
    expect(mockCreate).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ id: 'cs_test_123' });
  });

  it('passes correct params to stripe checkout', async () => {
    mockCreate.mockResolvedValueOnce({ id: 'cs_test_123' });
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
  });

  it('transforms image URLs correctly', async () => {
    mockCreate.mockResolvedValueOnce({ id: 'cs_test_123' });
    await handler(req, res);
    const callArgs = mockCreate.mock.calls[0][0];
    const lineItem = callArgs.line_items[0];
    expect(lineItem.price_data.product_data.images[0]).toContain('https://cdn.sanity.io/images/vfxfwnaw/production/');
    expect(lineItem.price_data.product_data.images[0]).toContain('.webp');
  });

  it('sets correct price in cents', async () => {
    mockCreate.mockResolvedValueOnce({ id: 'cs_test_123' });
    await handler(req, res);
    const callArgs = mockCreate.mock.calls[0][0];
    const lineItem = callArgs.line_items[0];
    expect(lineItem.price_data.unit_amount).toBe(25000);
  });

  it('sets correct quantity', async () => {
    mockCreate.mockResolvedValueOnce({ id: 'cs_test_123' });
    await handler(req, res);
    const callArgs = mockCreate.mock.calls[0][0];
    const lineItem = callArgs.line_items[0];
    expect(lineItem.quantity).toBe(2);
  });

  it('sets currency to usd', async () => {
    mockCreate.mockResolvedValueOnce({ id: 'cs_test_123' });
    await handler(req, res);
    const callArgs = mockCreate.mock.calls[0][0];
    expect(callArgs.line_items[0].price_data.currency).toBe('usd');
  });

  it('handles stripe errors with statusCode', async () => {
    const error = { statusCode: 400, message: 'Invalid request' };
    mockCreate.mockRejectedValueOnce(error);
    await handler(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith('Invalid request');
  });

  it('defaults to 500 for errors without statusCode', async () => {
    const error = { message: 'Unknown error' };
    mockCreate.mockRejectedValueOnce(error);
    await handler(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
  });

  it('returns 405 for non-POST methods', async () => {
    req.method = 'GET';
    await handler(req, res);
    expect(res.setHeader).toHaveBeenCalledWith('Allow', 'POST');
    expect(res.status).toHaveBeenCalledWith(405);
    expect(res.end).toHaveBeenCalledWith('Method Not Allowed');
  });

  it('returns 405 for PUT method', async () => {
    req.method = 'PUT';
    await handler(req, res);
    expect(res.status).toHaveBeenCalledWith(405);
  });

  it('returns 405 for DELETE method', async () => {
    req.method = 'DELETE';
    await handler(req, res);
    expect(res.status).toHaveBeenCalledWith(405);
  });

  it('handles multiple items in the body', async () => {
    req.body = [
      {
        name: 'Headphones',
        price: 250,
        quantity: 1,
        image: [{ asset: { _ref: 'image-abc-webp' } }],
      },
      {
        name: 'Speaker',
        price: 100,
        quantity: 3,
        image: [{ asset: { _ref: 'image-def-webp' } }],
      },
    ];
    mockCreate.mockResolvedValueOnce({ id: 'cs_test_456' });
    await handler(req, res);
    const callArgs = mockCreate.mock.calls[0][0];
    expect(callArgs.line_items).toHaveLength(2);
    expect(callArgs.line_items[1].price_data.product_data.name).toBe('Speaker');
    expect(callArgs.line_items[1].quantity).toBe(3);
  });

  it('includes adjustable quantity in line items', async () => {
    mockCreate.mockResolvedValueOnce({ id: 'cs_test_123' });
    await handler(req, res);
    const callArgs = mockCreate.mock.calls[0][0];
    expect(callArgs.line_items[0].adjustable_quantity).toEqual({
      enabled: true,
      minimum: 1,
    });
  });

  it('includes shipping options', async () => {
    mockCreate.mockResolvedValueOnce({ id: 'cs_test_123' });
    await handler(req, res);
    const callArgs = mockCreate.mock.calls[0][0];
    expect(callArgs.shipping_options).toEqual([
      { shipping_rate: 'shr_1Kn3IaEnylLNWUqj5rqhg9oV' },
    ]);
  });
});
