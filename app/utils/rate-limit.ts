export const createFixedWindowRateLimiter = ({
  limit,
  windowMs,
  now = Date.now,
}: {
  limit: number;
  windowMs: number;
  now?: () => number;
}) => {
  const requestsByKey = new Map<string, number[]>();

  return {
    allow(key: string) {
      const currentTime = now();
      const requests = (requestsByKey.get(key) ?? []).filter(
        (timestamp) => currentTime - timestamp < windowMs,
      );
      if (requests.length >= limit) {
        requestsByKey.set(key, requests);
        return false;
      }
      requests.push(currentTime);
      requestsByKey.set(key, requests);
      return true;
    },
    clear(key: string) {
      requestsByKey.delete(key);
    },
  };
};
