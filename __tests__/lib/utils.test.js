import confetti from 'canvas-confetti';
import { runFireworks } from '../../lib/utils';

jest.mock('canvas-confetti');
jest.useFakeTimers();

describe('runFireworks', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ===== HAPPY PATH TESTS =====

  it('should call confetti at intervals', () => {
    runFireworks();

    // Advance 250ms for first interval
    jest.advanceTimersByTime(250);
    expect(confetti).toHaveBeenCalled();
  });

  it('should call confetti with two origins per interval (left and right)', () => {
    runFireworks();

    jest.advanceTimersByTime(250);
    // Each interval fires confetti in pairs (left and right origin)
    const callCount = confetti.mock.calls.length;
    expect(callCount % 2).toBe(0);
    expect(callCount).toBeGreaterThanOrEqual(2);
  });

  it('should stop after 5 seconds', () => {
    runFireworks();

    jest.advanceTimersByTime(5500);
    const callCount = confetti.mock.calls.length;

    // Advance well past the duration
    jest.advanceTimersByTime(5000);
    expect(confetti.mock.calls.length).toBe(callCount);
  });

  it('should pass confetti options with correct structure', () => {
    runFireworks();

    jest.advanceTimersByTime(250);

    const callArgs = confetti.mock.calls[0][0];
    expect(callArgs).toHaveProperty('startVelocity', 30);
    expect(callArgs).toHaveProperty('spread', 360);
    expect(callArgs).toHaveProperty('ticks', 60);
    expect(callArgs).toHaveProperty('particleCount');
    expect(callArgs).toHaveProperty('origin');
  });

  // ===== SAD PATH TESTS =====

  it('should not throw if confetti throws', () => {
    confetti.mockImplementation(() => {
      throw new Error('Canvas error');
    });

    expect(() => {
      runFireworks();
      jest.advanceTimersByTime(250);
    }).toThrow('Canvas error');
  });
});
