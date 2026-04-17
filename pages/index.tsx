import React from 'react';
import type { GetServerSideProps } from 'next';

import { client } from '../lib/client';
import { Product, FooterBanner, HeroBanner } from '../components';
import { Product as ProductType, Banner } from '../types';

interface HomeProps {
  products: ProductType[];
  bannerData: Banner[];
}

const Home = ({ products, bannerData }: HomeProps) => (
  <div>
    <HeroBanner heroBanner={bannerData.length && bannerData[0]}  />
    <div className="products-heading">
      <h2>Best Seller Products</h2>
      <p>speaker There are many variations passages</p>
    </div>

    <div className="products-container">
      {products?.map((product) => <Product key={product._id} product={product} />)}
    </div>

    <FooterBanner footerBanner={bannerData && bannerData[0]} />
  </div>
);

export const getServerSideProps: GetServerSideProps<HomeProps> = async () => {
  const query = '*[_type == "product"]';
  const products = await client.fetch(query);

  const bannerQuery = '*[_type == "banner"]';
  const bannerData = await client.fetch(bannerQuery);

  return {
    props: { products, bannerData }
  }
}

export default Home;
