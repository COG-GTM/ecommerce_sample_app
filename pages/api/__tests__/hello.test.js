import handler from '../hello';

describe('Hello API handler', () => {
  it('returns 200 with name', () => {
    const res = {
      status: jest.fn(() => res),
      json: jest.fn(() => res),
    };

    handler({}, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ name: 'John Doe' });
  });
});
