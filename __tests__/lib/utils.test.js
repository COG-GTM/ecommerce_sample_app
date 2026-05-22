jest.mock('canvas-confetti', () => jest.fn());

describe('runFireworks', () => {
  let confetti;

  beforeEach(() => {
    jest.useFakeTimers();
    jest.resetModules();
    confetti = require('canvas-confetti');
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('calls confetti function', () => {
    const { runFireworks } = require('../../lib/utils');
    runFireworks();
    jest.advanceTimersByTime(250);
    expect(confetti).toHaveBeenCalled();
  });

  it('calls confetti twice per interval (left and right)', () => {
    const { runFireworks } = require('../../lib/utils');
    runFireworks();
    jest.advanceTimersByTime(250);
    expect(confetti).toHaveBeenCalledTimes(2);
  });

  it('stops calling confetti after duration expires', () => {
    const { runFireworks } = require('../../lib/utils');
    runFireworks();
    jest.advanceTimersByTime(5000);
    const callCount = confetti.mock.calls.length;
    jest.advanceTimersByTime(1000);
    expect(confetti.mock.calls.length).toBe(callCount);
  });

  it('calls confetti with correct defaults shape', () => {
    const { runFireworks } = require('../../lib/utils');
    runFireworks();
    jest.advanceTimersByTime(250);
    expect(confetti).toHaveBeenCalledWith(
      expect.objectContaining({
        startVelocity: 30,
        spread: 360,
        ticks: 60,
        zIndex: 0,
      })
    );
  });

  it('calls confetti with origin.x in expected ranges', () => {
    const { runFireworks } = require('../../lib/utils');
    runFireworks();
    jest.advanceTimersByTime(250);
    const calls = confetti.mock.calls;
    // First call (left side)
    expect(calls[0][0].origin.x).toBeGreaterThanOrEqual(0.1);
    expect(calls[0][0].origin.x).toBeLessThanOrEqual(0.3);
    // Second call (right side)
    expect(calls[1][0].origin.x).toBeGreaterThanOrEqual(0.7);
    expect(calls[1][0].origin.x).toBeLessThanOrEqual(0.9);
  });

  it('continues calling confetti at 250ms intervals', () => {
    const { runFireworks } = require('../../lib/utils');
    runFireworks();
    jest.advanceTimersByTime(500);
    expect(confetti.mock.calls.length).toBe(4);
    jest.advanceTimersByTime(250);
    expect(confetti.mock.calls.length).toBe(6);
  });
});
