const Stripe = jest.fn(() => ({
  checkout: {
    sessions: {
      create: jest.fn(),
    },
  },
}));

export default Stripe;
