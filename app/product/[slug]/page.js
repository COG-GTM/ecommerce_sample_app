import { client } from '../../../lib/client';
import { Product } from '../../../components';
import ProductDetailClient from './ProductDetailClient';

export async function generateStaticParams() {
  const products = await client.fetch('*[_type == "product"] { slug { current } }');
  return products.map((product) => ({ slug: product.slug.current }));
}

export const revalidate = 60;

export default async function ProductDetail({ params }) {
  const { slug } = await params;
  const query = `*[_type == "product" && slug.current == '${slug}'][0]`;
  const productsQuery = '*[_type == "product"]';

  const product = await client.fetch(query);
  const products = await client.fetch(productsQuery);

  return (
    <div>
      <ProductDetailClient product={product} />

      <div className="maylike-products-wrapper">
        <h2>You may also like</h2>
        <div className="marquee">
          <div className="maylike-products-container track">
            {products.map((item) => (
              <Product key={item._id} product={item} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
