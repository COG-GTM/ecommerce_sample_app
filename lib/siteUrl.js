const DEV_SITE_URL = 'http://localhost:3000';

const toOrigin = (value, name) => {
  let url;
  try {
    url = new URL(value);
  } catch (err) {
    throw new Error(`${name} must be an absolute URL`);
  }

  if (url.protocol !== 'https:' && url.protocol !== 'http:') {
    throw new Error(`${name} must use http or https`);
  }

  return url.origin;
};

export const getSiteUrl = (env = process.env) => {
  if (env.SITE_URL) return toOrigin(env.SITE_URL, 'SITE_URL');
  if (env.VERCEL_URL) return toOrigin(`https://${env.VERCEL_URL}`, 'VERCEL_URL');
  if (env.NODE_ENV === 'development') return DEV_SITE_URL;

  throw new Error('SITE_URL is not configured');
};
