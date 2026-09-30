import sanityClient from '@sanity/client';

import { sanityConfig } from './client';

const token = process.env.SANITY_READ_TOKEN;

export const serverClient = token
  ? sanityClient({ ...sanityConfig, useCdn: false, token })
  : sanityClient(sanityConfig);
