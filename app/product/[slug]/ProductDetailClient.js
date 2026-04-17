'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { AiOutlineMinus, AiOutlinePlus, AiFillStar, AiOutlineStar } from 'react-icons/ai';

import { urlFor } from '../../../lib/client';
import { useStateContext } from '../../../context/StateContext';

const ProductDetailClient = ({ product }) => {
  const { image, name, details, price } = product;
  const [index, setIndex] = useState(0);
  const { decQty, incQty, qty, onAdd, setShowCart } = useStateContext();

  const handleBuyNow = () => {
    onAdd(product, qty);
    setShowCart(true);
  };

  return (
    <div className="product-detail-container">
      <div>
        <div className="image-container">
          <Image
            src={urlFor(image && image[index]).url()}
            alt={name}
            width={400}
            height={400}
            className="product-detail-image"
          />
        </div>
        <div className="small-images-container">
          {image?.map((item, i) => (
            <Image
              key={i}
              src={urlFor(item).url()}
              alt={`${name} thumbnail ${i + 1}`}
              width={70}
              height={70}
              className={i === index ? 'small-image selected-image' : 'small-image'}
              onMouseEnter={() => setIndex(i)}
            />
          ))}
        </div>
      </div>

      <div className="product-detail-desc">
        <h1>{name}</h1>
        <div className="reviews">
          <div>
            <AiFillStar />
            <AiFillStar />
            <AiFillStar />
            <AiFillStar />
            <AiOutlineStar />
          </div>
          <p>(20)</p>
        </div>
        <h4>Details: </h4>
        <p>{details}</p>
        <p className="price">${price}</p>
        <div className="quantity">
          <h3>Quantity:</h3>
          <p className="quantity-desc">
            <span className="minus" onClick={decQty}><AiOutlineMinus /></span>
            <span className="num">{qty}</span>
            <span className="plus" onClick={incQty}><AiOutlinePlus /></span>
          </p>
        </div>
        <div className="buttons">
          <button type="button" className="add-to-cart" onClick={() => onAdd(product, qty)}>Add to Cart</button>
          <button type="button" className="buy-now" onClick={handleBuyNow}>Buy Now</button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailClient;
