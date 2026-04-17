import React from 'react';
import Link from 'next/link';

import { urlFor } from '../lib/client';

const FooterBanner = ({ footerBanner: { discount, largeText1, largeText2, saleTime, smallText, midText, desc, product, buttonText, image } }) => {
  return (
    <div className="py-[100px] px-10 bg-primary rounded-[15px] relative h-[400px] leading-none text-white w-full mt-[120px] max-800:h-[560px] max-800:mt-20">
      <div className="flex justify-between max-800:flex-wrap max-800:gap-5">
        <div>
          <p>{discount}</p>
          <h3 className="font-black text-[80px] ml-[25px] max-800:text-[50px] max-800:ml-[5px]">{largeText1}</h3>
          <h3 className="font-black text-[80px] ml-[25px] max-800:text-[50px] max-800:ml-[5px]">{largeText2}</h3>
          <p className="m-[18px]">{saleTime}</p>
        </div>
        <div className="leading-[1.4]">
          <p>{smallText}</p>
          <h3 className="font-extrabold text-[60px] max-800:text-[45px]">{midText}</h3>
          <p className="text-lg max-800:text-lg">{desc}</p>
          <Link href={`/product/${product}`}>
            <button type="button" className="rounded-[15px] py-2.5 px-4 bg-white text-[red] border-none mt-10 text-lg font-medium cursor-pointer">{buttonText}</button>
          </Link>
        </div>

        <img 
          src={urlFor(image)} className="absolute -top-1/4 left-1/4 max-800:w-[77%] max-800:left-[30%] max-800:top-[6%] max-800:h-[56%]"
        />
      </div>
    </div>
  )
}

export default FooterBanner
