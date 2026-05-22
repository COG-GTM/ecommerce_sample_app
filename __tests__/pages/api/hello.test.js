import handler from '../../../pages/api/hello';

describe('Hello API Route', () => {
  let req, res;

  beforeEach(() => {
    req = {};
    res = {
      status: jest.fn(() => res),
      json: jest.fn(() => res),
    };
  });

  it('returns 200 status code', () => {
    handler(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it('returns correct JSON body', () => {
    handler(req, res);
    expect(res.json).toHaveBeenCalledWith({ name: 'John Doe' });
  });

  it('calls status before json', () => {
    handler(req, res);
    const statusOrder = res.status.mock.invocationCallOrder[0];
    const jsonOrder = res.json.mock.invocationCallOrder[0];
    expect(statusOrder).toBeLessThan(jsonOrder);
  });
});
