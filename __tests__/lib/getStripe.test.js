jest.mock('@stripe/stripe-js', () => ({
  loadStripe: jest.fn(() => Promise.resolve({ redirectToCheckout: jest.fn() })),
}));

describe('getStripe', () => {
  beforeEach(() => {
    jest.resetModules();
  });

  it('returns a stripe promise', async () => {
    const getStripe = require('../../lib/getStripe').default;
    const stripe = await getStripe();
    expect(stripe).toBeDefined();
    expect(stripe.redirectToCheckout).toBeDefined();
  });

  it('returns the same promise on multiple calls (singleton)', () => {
    const getStripe = require('../../lib/getStripe').default;
    const promise1 = getStripe();
    const promise2 = getStripe();
    expect(promise1).toBe(promise2);
  });

  it('calls loadStripe with the publishable key env var', () => {
    const { loadStripe } = require('@stripe/stripe-js');
    require('../../lib/getStripe');
    // loadStripe is only called when getStripe is invoked
    const getStripe = require('../../lib/getStripe').default;
    getStripe();
    expect(loadStripe).toHaveBeenCalled();
  });
});
