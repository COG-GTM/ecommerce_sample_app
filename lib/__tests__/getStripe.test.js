const mockLoadStripe = jest.fn(() => Promise.resolve({ redirectToCheckout: jest.fn() }));

jest.mock('@stripe/stripe-js', () => ({
  loadStripe: (...args) => mockLoadStripe(...args),
}));

describe('getStripe', () => {
  beforeEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
  });

  it('returns a stripe promise', async () => {
    const getStripe = require('../getStripe').default;
    const result = getStripe();
    expect(result).toBeDefined();
    expect(result instanceof Promise).toBe(true);
  });

  it('caches the promise on second call (singleton)', () => {
    const getStripe = require('../getStripe').default;
    const first = getStripe();
    const second = getStripe();
    expect(first).toBe(second);
    expect(mockLoadStripe).toHaveBeenCalledTimes(1);
  });
});
