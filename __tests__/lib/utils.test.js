import { runFireworks } from '../../lib/utils';

jest.mock('canvas-confetti', () => jest.fn());

const confetti = require('canvas-confetti');

describe('runFireworks', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    confetti.mockClear();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should call confetti at intervals (happy path)', () => {
    runFireworks();

    // Advance 250ms to trigger first interval
    jest.advanceTimersByTime(250);
    expect(confetti).toHaveBeenCalled();
    // Each interval fires confetti twice (left and right)
    expect(confetti).toHaveBeenCalledTimes(2);
  });

  it('should stop firing after 5 seconds', () => {
    runFireworks();

    // Advance past the full 5s duration + a bit more
    jest.advanceTimersByTime(5500);

    const callCount = confetti.mock.calls.length;

    // Advance another second - should not increase
    jest.advanceTimersByTime(1000);
    expect(confetti.mock.calls.length).toBe(callCount);
  });

  it('should call confetti with correct default properties', () => {
    runFireworks();
    jest.advanceTimersByTime(250);

    const firstCall = confetti.mock.calls[0][0];
    expect(firstCall).toHaveProperty('startVelocity', 30);
    expect(firstCall).toHaveProperty('spread', 360);
    expect(firstCall).toHaveProperty('ticks', 60);
    expect(firstCall).toHaveProperty('zIndex', 0);
    expect(firstCall).toHaveProperty('particleCount');
    expect(firstCall).toHaveProperty('origin');
  });
});
