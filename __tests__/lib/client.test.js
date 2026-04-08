jest.mock('@sanity/client', () => jest.fn(() => ({ fetch: jest.fn() })));
jest.mock('@sanity/image-url', () => jest.fn(() => ({
  image: jest.fn(() => 'mocked-image-url'),
})));

describe('lib/client', () => {
  it('should create a sanity client with correct config', () => {
    const sanityClient = require('@sanity/client');
    require('../../lib/client');

    expect(sanityClient).toHaveBeenCalledWith(
      expect.objectContaining({
        projectId: 'vfxfwnaw',
        dataset: 'production',
        apiVersion: '2022-03-10',
        useCdn: true,
      })
    );
  });

  it('should export urlFor that returns an image url (happy path)', () => {
    const { urlFor } = require('../../lib/client');
    const result = urlFor('some-image-source');
    expect(result).toBe('mocked-image-url');
  });

  it('should export a client object', () => {
    const { client } = require('../../lib/client');
    expect(client).toBeDefined();
    expect(client.fetch).toBeDefined();
  });
});
