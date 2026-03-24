import NodeCache from "node-cache";

const cache = new NodeCache({ stdTTL: 120, checkperiod: 150 });

export const cacheGet = (keyFn) => (req, res, next) => {
  const key = keyFn(req);
  const cached = cache.get(key);
  if (cached) {
    return res.status(200).json(cached);
  }

  const originalJson = res.json.bind(res);
  res.json = (body) => {
    cache.set(key, body);
    return originalJson(body);
  };

  next();
};

export const cacheInvalidateByPrefix = (prefix) => {
  cache.keys().forEach((key) => {
    if (key.startsWith(prefix)) {
      cache.del(key);
    }
  });
};
