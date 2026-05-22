const mockCreate = jest.fn();

jest.mock('stripe', () => {
  return jest.fn(() => ({
    checkout: {
      sessions: {
        create: mockCreate,
      },
    },
  }));
});

const handler = require('../stripe').default;

describe('Stripe API handler', () => {
  let req, res;

  beforeEach(() => {
    jest.clearAllMocks();
    req = {
      method: 'POST',
      headers: { origin: 'http://localhost:3000' },
      body: [
        {
          name: 'Test Product',
          price: 100,
          quantity: 2,
          image: [{ asset: { _ref: 'image-abc123-100x100-webp' } }],
        },
      ],
    };
    res = {
      status: jest.fn(() => res),
      json: jest.fn(() => res),
      setHeader: jest.fn(),
      end: jest.fn(),
    };
  });

  it('POST creates checkout session and returns 200', async () => {
    const mockSession = { id: 'session_123' };
    mockCreate.mockResolvedValueOnce(mockSession);

    await handler(req, res);

    expect(mockCreate).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockSession);
  });

  it('non-POST returns 405', async () => {
    req.method = 'GET';

    await handler(req, res);

    expect(res.setHeader).toHaveBeenCalledWith('Allow', 'POST');
    expect(res.status).toHaveBeenCalledWith(405);
    expect(res.end).toHaveBeenCalledWith('Method Not Allowed');
  });

  it('Stripe error returns error status code', async () => {
    const error = new Error('Payment required');
    error.statusCode = 402;
    mockCreate.mockRejectedValueOnce(error);

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(402);
    expect(res.json).toHaveBeenCalledWith('Payment required');
  });

  it('Stripe error without statusCode returns 500', async () => {
    const error = new Error('Unknown error');
    mockCreate.mockRejectedValueOnce(error);

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
  });
});
