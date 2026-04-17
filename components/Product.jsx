import React from 'react';
import Link from 'next/link';

import { urlFor } from '../lib/client';

const Product = ({ product: { image, name, slug, price } }) => {
  return (
    <div>
      <Link href={`/product/${slug.current}`}>
        <div className="cursor-pointer scale-100 transition-transform duration-500 ease-in-out text-dark-blue hover:scale-110">
          <img 
            src={urlFor(image && image[0])}
            width={250}
            height={250}
            className="rounded-[15px] bg-light-gray scale-100 transition-transform duration-500 ease-in-out"
          />
          <p className="font-medium">{name}</p>
          <p className="font-extrabold mt-1.5 text-black">${price}</p>
        </div>
      </Link>
    </div>
  )
}

export default Product
