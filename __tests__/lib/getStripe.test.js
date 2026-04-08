import getStripe from '../../lib/getStripe';

jest.mock('@stripe/stripe-js', () => ({
  loadStripe: jest.fn(() => Promise.resolve({ id: 'mock-stripe-instance' })),
}));

const { loadStripe } = require('@stripe/stripe-js');

describe('getStripe', () => {
  beforeEach(() => {
    // Reset the cached stripePromise between tests by re-requiring
    jest.resetModules();
  });

  it('should call loadStripe and return a promise (happy path)', async () => {
    const result = getStripe();
    expect(result).toBeDefined();

    const stripe = await result;
    expect(stripe).toEqual({ id: 'mock-stripe-instance' });
  });

  it('should return the same cached instance on subsequent calls (singleton)', () => {
    const first = getStripe();
    const second = getStripe();
    expect(first).toBe(second);
  });
});
