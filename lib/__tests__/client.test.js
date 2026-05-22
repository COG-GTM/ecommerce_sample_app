jest.mock('@sanity/client', () => {
  const mockClient = { fetch: jest.fn(), config: jest.fn() };
  return jest.fn(() => mockClient);
});

jest.mock('@sanity/image-url', () => {
  const mockBuilder = {
    image: jest.fn(() => ({ url: jest.fn(() => 'https://cdn.sanity.io/test.webp') })),
  };
  return jest.fn(() => mockBuilder);
});

describe('client module', () => {
  it('exports a sanity client', () => {
    const { client } = require('../client');
    expect(client).toBeDefined();
    expect(client.fetch).toBeDefined();
  });

  it('urlFor returns an image builder result', () => {
    const { urlFor } = require('../client');
    const result = urlFor({ asset: { _ref: 'image-test' } });
    expect(result).toBeDefined();
  });
});
