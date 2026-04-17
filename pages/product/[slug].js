import React, { useState } from 'react';
import { AiOutlineMinus, AiOutlinePlus, AiFillStar, AiOutlineStar } from 'react-icons/ai';

import { client, urlFor } from '../../lib/client';
import { Product } from '../../components';
import { useStateContext } from '../../context/StateContext';

const ProductDetails = ({ product, products }) => {
  const { image, name, details, price } = product;
  const [index, setIndex] = useState(0);
  const { decQty, incQty, qty, onAdd, setShowCart } = useStateContext();

  const handleBuyNow = () => {
    onAdd(product, qty);

    setShowCart(true);
  }

  return (
    <div>
      <div className="flex gap-10 m-10 mt-[60px] text-dark-blue max-800:flex-wrap max-800:m-5">
        <div>
          <div>
            <img src={urlFor(image && image[index])} className="rounded-[15px] bg-light-gray w-[400px] h-[400px] cursor-pointer transition-[0.3s] ease-in-out hover:bg-primary max-800:w-[350px] max-800:h-[350px]" />
          </div>
          <div className="flex gap-2.5 mt-5">
            {image?.map((item, i) => (
              <img 
                key={i}
                src={urlFor(item)}
                className={i === index ? 'rounded-lg bg-primary w-[70px] h-[70px] cursor-pointer' : 'rounded-lg bg-light-gray w-[70px] h-[70px] cursor-pointer'}
                onMouseEnter={() => setIndex(i)}
              />
            ))}
          </div>
        </div>

        <div className="[&>h4]:mt-2.5 [&>p]:mt-2.5">
          <h1>{name}</h1>
          <div className="text-primary mt-2.5 flex gap-[5px] items-center">
            <div>
              <AiFillStar />
              <AiFillStar />
              <AiFillStar />
              <AiFillStar />
              <AiOutlineStar />
            </div>
            <p className="text-dark-blue !mt-0">
              (20)
            </p>
          </div>
          <h4>Details: </h4>
          <p>{details}</p>
          <p className="font-bold text-[26px] mt-[30px] text-primary">${price}</p>
          <div className="flex gap-5 mt-2.5 items-center">
            <h3>Quantity:</h3>
            <p className="border border-gray-500 p-1.5">
              <span className="text-base py-1.5 px-3 cursor-pointer border-r border-gray-500 text-primary" onClick={decQty}><AiOutlineMinus /></span>
              <span className="text-xl py-1.5 px-3 cursor-pointer border-r border-gray-500">{qty}</span>
              <span className="text-base py-1.5 px-3 cursor-pointer text-qty-green" onClick={incQty}><AiOutlinePlus /></span>
            </p>
          </div>
          <div className="flex gap-[30px]">
            <button type="button" className="py-2.5 px-5 border border-primary mt-10 text-lg font-medium bg-white text-primary cursor-pointer w-[200px] scale-100 transition-transform duration-500 ease-in-out hover:scale-110 max-800:w-[150px]" onClick={() => onAdd(product, qty)}>Add to Cart</button>
            <button type="button" className="w-[200px] py-2.5 px-5 bg-primary text-white border-none mt-10 text-lg font-medium cursor-pointer scale-100 transition-transform duration-500 ease-in-out hover:scale-110 max-800:w-[150px]" onClick={handleBuyNow}>Buy Now</button>
          </div>
        </div>
      </div>

      <div className="mt-[120px]">
          <h2 className="text-center m-[50px] text-dark-blue text-[28px]">You may also like</h2>
          <div className="relative h-[400px] w-full overflow-x-hidden">
            <div className="flex justify-center gap-[15px] mt-5 absolute whitespace-nowrap will-change-transform animate-marquee w-[180%] hover:[animation-play-state:paused] max-800:animate-marquee-mobile max-800:w-[550%]">
              {products.map((item) => (
                <Product key={item._id} product={item} />
              ))}
            </div>
          </div>
      </div>
    </div>
  )
}

export const getStaticPaths = async () => {
  const query = `*[_type == "product"] {
    slug {
      current
    }
  }
  `;

  const products = await client.fetch(query);

  const paths = products.map((product) => ({
    params: { 
      slug: product.slug.current
    }
  }));

  return {
    paths,
    fallback: 'blocking'
  }
}

export const getStaticProps = async ({ params: { slug }}) => {
  const query = `*[_type == "product" && slug.current == '${slug}'][0]`;
  const productsQuery = '*[_type == "product"]'
  
  const product = await client.fetch(query);
  const products = await client.fetch(productsQuery);

  console.log(product);

  return {
    props: { products, product }
  }
}

export default ProductDetails
