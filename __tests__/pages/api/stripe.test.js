const mockCreate = jest.fn();

jest.mock('stripe', () => {
  // Use a getter to lazily reference mockCreate after it's initialized
  return {
    __esModule: true,
    default: jest.fn().mockImplementation(() => ({
      checkout: {
        sessions: {
          get create() { return mockCreate; },
        },
      },
    })),
  };
});

import handler from '../../../pages/api/stripe';

const createMockReq = (method, body = []) => ({
  method,
  body,
  headers: { origin: 'http://localhost:3000' },
});

const createMockRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.end = jest.fn().mockReturnValue(res);
  res.setHeader = jest.fn().mockReturnValue(res);
  return res;
};

const mockCartItems = [
  {
    name: 'Headphones',
    price: 100,
    quantity: 2,
    image: [{ asset: { _ref: 'image-abc123-webp' } }],
  },
];

describe('Stripe API Route', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ===== HAPPY PATH TESTS =====

  it('should create a checkout session on POST', async () => {
    const mockSession = { id: 'cs_test_123' };
    mockCreate.mockResolvedValue(mockSession);

    const req = createMockReq('POST', mockCartItems);
    const res = createMockRes();

    await handler(req, res);

    expect(mockCreate).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockSession);
  });

  it('should map cart items to Stripe line_items format', async () => {
    mockCreate.mockResolvedValue({ id: 'cs_test_123' });

    const req = createMockReq('POST', mockCartItems);
    const res = createMockRes();

    await handler(req, res);

    const params = mockCreate.mock.calls[0][0];
    expect(params.line_items).toHaveLength(1);
    expect(params.line_items[0].price_data.currency).toBe('usd');
    expect(params.line_items[0].price_data.product_data.name).toBe('Headphones');
    expect(params.line_items[0].price_data.unit_amount).toBe(10000); // 100 * 100
    expect(params.line_items[0].quantity).toBe(2);
  });

  it('should transform Sanity image refs to CDN URLs', async () => {
    mockCreate.mockResolvedValue({ id: 'cs_test_123' });

    const req = createMockReq('POST', mockCartItems);
    const res = createMockRes();

    await handler(req, res);

    const params = mockCreate.mock.calls[0][0];
    const images = params.line_items[0].price_data.product_data.images;
    expect(images[0]).toContain('https://cdn.sanity.io/images/');
    expect(images[0]).toContain('.webp');
  });

  it('should set correct success and cancel URLs', async () => {
    mockCreate.mockResolvedValue({ id: 'cs_test_123' });

    const req = createMockReq('POST', mockCartItems);
    const res = createMockRes();

    await handler(req, res);

    const params = mockCreate.mock.calls[0][0];
    expect(params.success_url).toBe('http://localhost:3000/success');
    expect(params.cancel_url).toBe('http://localhost:3000/canceled');
  });

  it('should handle multiple items in cart', async () => {
    mockCreate.mockResolvedValue({ id: 'cs_test_456' });

    const multipleItems = [
      ...mockCartItems,
      {
        name: 'Speakers',
        price: 50,
        quantity: 1,
        image: [{ asset: { _ref: 'image-def456-webp' } }],
      },
    ];

    const req = createMockReq('POST', multipleItems);
    const res = createMockRes();

    await handler(req, res);

    const params = mockCreate.mock.calls[0][0];
    expect(params.line_items).toHaveLength(2);
  });

  // ===== SAD PATH TESTS =====

  it('should return 405 for non-POST requests', async () => {
    const req = createMockReq('GET');
    const res = createMockRes();

    await handler(req, res);

    expect(res.setHeader).toHaveBeenCalledWith('Allow', 'POST');
    expect(res.status).toHaveBeenCalledWith(405);
    expect(res.end).toHaveBeenCalledWith('Method Not Allowed');
  });

  it('should return 405 for PUT requests', async () => {
    const req = createMockReq('PUT');
    const res = createMockRes();

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(405);
  });

  it('should return 405 for DELETE requests', async () => {
    const req = createMockReq('DELETE');
    const res = createMockRes();

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(405);
  });

  it('should handle Stripe errors with statusCode', async () => {
    const stripeError = new Error('Card declined');
    stripeError.statusCode = 402;
    mockCreate.mockRejectedValue(stripeError);

    const req = createMockReq('POST', mockCartItems);
    const res = createMockRes();

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(402);
    expect(res.json).toHaveBeenCalledWith('Card declined');
  });

  it('should return 500 for unknown errors', async () => {
    const unknownError = new Error('Something went wrong');
    mockCreate.mockRejectedValue(unknownError);

    const req = createMockReq('POST', mockCartItems);
    const res = createMockRes();

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith('Something went wrong');
  });

  it('should handle empty cart body', async () => {
    mockCreate.mockResolvedValue({ id: 'cs_test_empty' });

    const req = createMockReq('POST', []);
    const res = createMockRes();

    await handler(req, res);

    const params = mockCreate.mock.calls[0][0];
    expect(params.line_items).toHaveLength(0);
  });
});
