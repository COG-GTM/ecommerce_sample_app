import React from 'react';
import Link from 'next/link';

import { urlFor } from '../lib/client';

const HeroBanner = ({ heroBanner }) => {
  return (
    <div className="py-[100px] px-10 bg-medium-gray rounded-[15px] relative h-[500px] leading-[0.9] w-full max-800:h-[560px] max-800:leading-[1.3]">
      <div>
        <p className="text-xl">{heroBanner.smallText}</p>
        <h3 className="text-[4rem] mt-1 max-800:text-[40px]">{heroBanner.midText}</h3>
        <h1 className="text-white text-[10em] -ml-5 uppercase max-800:text-[50px]">{heroBanner.largeText1}</h1>
        <img src={urlFor(heroBanner.image)} alt="headphones" className="absolute top-0 right-[20%] w-[450px] h-[450px] max-800:w-[77%] max-800:h-[62%] max-800:-top-[2%] max-800:-right-[6%]" />

        <div>
          <Link href={`/product/${heroBanner.product}`}>
            <button type="button" className="rounded-[15px] py-2.5 px-4 bg-primary text-white border-none mt-10 text-lg font-medium cursor-pointer z-[10000] max-800:mt-[90px] max-800:z-[10000]">{heroBanner.buttonText}</button>
          </Link>
          <div className="absolute right-[10%] bottom-[5%] w-[300px] leading-[1.3] flex flex-col text-dark-blue max-800:bottom-[60px]">
            <h5 className="mb-3 font-bold text-base self-end">Description</h5>
            <p className="text-text-gray font-thin text-end">{heroBanner.desc}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HeroBanner
