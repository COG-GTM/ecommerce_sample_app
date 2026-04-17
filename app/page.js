import { client } from '../lib/client';
import { Product, FooterBanner, HeroBanner } from '../components';

export const revalidate = 60;

export default async function Home() {
  const products = await client.fetch('*[_type == "product"]');
  const bannerData = await client.fetch('*[_type == "banner"]');

  return (
    <div>
      <HeroBanner heroBanner={bannerData.length && bannerData[0]} />
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
}
