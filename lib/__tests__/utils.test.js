const mockConfetti = jest.fn();
jest.mock('canvas-confetti', () => mockConfetti);

describe('runFireworks', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.clearAllMocks();
    jest.spyOn(Date, 'now')
      .mockReturnValueOnce(0)    // initial call: animationEnd = 5000
      .mockReturnValue(1000);    // subsequent calls: timeLeft = 4000
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.restoreAllMocks();
  });

  it('calls confetti', () => {
    const { runFireworks } = require('../utils');
    runFireworks();
    jest.advanceTimersByTime(250);
    expect(mockConfetti).toHaveBeenCalled();
  });

  it('calls confetti twice per interval tick', () => {
    const { runFireworks } = require('../utils');
    runFireworks();
    jest.advanceTimersByTime(250);
    expect(mockConfetti).toHaveBeenCalledTimes(2);
  });

  it('clears interval when time runs out', () => {
    jest.restoreAllMocks();
    jest.spyOn(Date, 'now')
      .mockReturnValueOnce(0)
      .mockReturnValue(6000);

    jest.resetModules();
    jest.mock('canvas-confetti', () => mockConfetti);
    const { runFireworks } = require('../utils');
    const clearSpy = jest.spyOn(global, 'clearInterval');

    runFireworks();
    jest.advanceTimersByTime(250);
    expect(clearSpy).toHaveBeenCalled();
  });
});
