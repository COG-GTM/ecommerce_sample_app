import handler from '../../../pages/api/hello';

const createMockRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('Hello API Route', () => {
  // ===== HAPPY PATH TESTS =====

  it('should return 200 with name John Doe', () => {
    const req = {};
    const res = createMockRes();

    handler(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ name: 'John Doe' });
  });

  it('should return a JSON response', () => {
    const req = {};
    const res = createMockRes();

    handler(req, res);

    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ name: expect.any(String) })
    );
  });
});
