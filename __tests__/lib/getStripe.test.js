jest.mock('@stripe/stripe-js');

describe('getStripe', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetModules();
  });

  // ===== HAPPY PATH TESTS =====

  it('should call loadStripe with the publishable key', () => {
    jest.isolateModules(() => {
      const { loadStripe: mockLoadStripe } = require('@stripe/stripe-js');
      const getStripeFresh = require('../../lib/getStripe').default;
      getStripeFresh();
      expect(mockLoadStripe).toHaveBeenCalledTimes(1);
    });
  });

  it('should return a stripe promise', () => {
    jest.isolateModules(() => {
      const { loadStripe: mockLoadStripe } = require('@stripe/stripe-js');
      const mockStripe = { redirectToCheckout: jest.fn() };
      mockLoadStripe.mockReturnValue(Promise.resolve(mockStripe));

      const getStripeFresh = require('../../lib/getStripe').default;
      const result = getStripeFresh();
      expect(result).toBeTruthy();
    });
  });

  it('should return the same instance on subsequent calls (singleton)', () => {
    jest.isolateModules(() => {
      const { loadStripe: mockLoadStripe } = require('@stripe/stripe-js');
      const getStripeFresh = require('../../lib/getStripe').default;
      const first = getStripeFresh();
      const second = getStripeFresh();
      expect(first).toBe(second);
      expect(mockLoadStripe).toHaveBeenCalledTimes(1);
    });
  });

  // ===== SAD PATH TESTS =====

  it('should handle undefined STRIPE_PUBLISHABLE_KEY', () => {
    const originalKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
    delete process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;

    jest.isolateModules(() => {
      const getStripeFresh = require('../../lib/getStripe').default;
      const result = getStripeFresh();
      expect(result).toBeDefined();
    });

    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY = originalKey;
  });
});
