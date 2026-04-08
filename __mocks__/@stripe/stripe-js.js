export const loadStripe = jest.fn(() =>
  Promise.resolve({
    redirectToCheckout: jest.fn(),
  })
);
