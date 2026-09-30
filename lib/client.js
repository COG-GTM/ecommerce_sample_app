import sanityClient from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';

export const sanityConfig = {
  projectId: 'vfxfwnaw',
  dataset: 'production',
  apiVersion: '2022-03-10',
  useCdn: true
};

export const client = sanityClient(sanityConfig);

const builder = imageUrlBuilder(client);

export const urlFor = (source) => builder.image(source);
