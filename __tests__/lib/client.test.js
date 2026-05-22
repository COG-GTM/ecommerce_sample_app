jest.mock('@sanity/client', () => {
  return jest.fn(() => ({
    fetch: jest.fn(),
    create: jest.fn(),
    patch: jest.fn(),
  }));
});

jest.mock('@sanity/image-url', () => {
  const mockImage = jest.fn((source) => ({
    url: () => `https://cdn.sanity.io/images/mock/${source}`,
    toString: () => `https://cdn.sanity.io/images/mock/${source}`,
  }));
  return jest.fn(() => ({
    image: mockImage,
  }));
});

describe('Sanity client module', () => {
  let client, urlFor;

  beforeEach(() => {
    jest.resetModules();
    const clientModule = require('../../lib/client');
    client = clientModule.client;
    urlFor = clientModule.urlFor;
  });

  it('exports a sanity client instance', () => {
    expect(client).toBeDefined();
  });

  it('client has fetch method', () => {
    expect(client.fetch).toBeDefined();
  });

  it('exports urlFor function', () => {
    expect(urlFor).toBeDefined();
    expect(typeof urlFor).toBe('function');
  });

  it('urlFor returns an image builder result', () => {
    const result = urlFor('test-image-ref');
    expect(result).toBeDefined();
  });

  it('sanityClient is called with correct config', () => {
    const sanityClient = require('@sanity/client');
    expect(sanityClient).toHaveBeenCalledWith(
      expect.objectContaining({
        projectId: 'vfxfwnaw',
        dataset: 'production',
        apiVersion: '2022-03-10',
        useCdn: true,
      })
    );
  });

  it('imageUrlBuilder is initialized with the client', () => {
    const imageUrlBuilder = require('@sanity/image-url');
    expect(imageUrlBuilder).toHaveBeenCalled();
  });
});
