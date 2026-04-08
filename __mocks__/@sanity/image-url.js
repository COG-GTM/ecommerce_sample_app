const imageUrlBuilder = jest.fn(() => ({
  image: jest.fn((source) => `https://cdn.sanity.io/mock-image/${source}`),
}));

export default imageUrlBuilder;
