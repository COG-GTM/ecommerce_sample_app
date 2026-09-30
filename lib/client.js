import sanityClient from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';

const config = {
  projectId: 'vfxfwnaw',
  dataset: 'production',
  apiVersion: '2022-03-10',
  useCdn: true,
  token: process.env.NEXT_PUBLIC_SANITY_TOKEN
};

export const client = sanityClient(config);

export const liveClient = sanityClient({ ...config, useCdn: false });

const builder = imageUrlBuilder(client);

export const urlFor = (source) => builder.image(source);