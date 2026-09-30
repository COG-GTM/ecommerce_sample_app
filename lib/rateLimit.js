const MAX_TRACKED_CLIENTS = 10000;

export const createRateLimiter = ({ limit, windowMs, now = () => Date.now() }) => {
  const hits = new Map();

  return (key) => {
    const current = now();
    const entry = hits.get(key);

    if (!entry || current >= entry.resetAt) {
      if (hits.size >= MAX_TRACKED_CLIENTS) {
        hits.forEach((value, clientKey) => {
          if (current >= value.resetAt) hits.delete(clientKey);
        });
        if (hits.size >= MAX_TRACKED_CLIENTS) return false;
      }
      hits.set(key, { count: 1, resetAt: current + windowMs });
      return true;
    }

    if (entry.count >= limit) return false;

    entry.count += 1;
    return true;
  };
};

export const clientIp = (req) => {
  const forwarded = req.headers['x-forwarded-for'];
  const first = typeof forwarded === 'string' ? forwarded.split(',')[0].trim() : '';

  return req.headers['x-real-ip'] || first || req.socket?.remoteAddress || 'unknown';
};
