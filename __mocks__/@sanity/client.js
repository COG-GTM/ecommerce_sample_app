const client = {
  fetch: jest.fn(),
};

const sanityClient = jest.fn(() => client);

export default sanityClient;
export { client };
