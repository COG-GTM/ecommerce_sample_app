import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { BsBagCheckFill } from 'react-icons/bs';

import { useStateContext } from '../context/StateContext';
import { runFireworks } from '../lib/utils';

const Success = () => {
  const { setCartItems, setTotalPrice, setTotalQuantities } = useStateContext();
  
  useEffect(() => {
    localStorage.clear();
    setCartItems([]);
    setTotalPrice(0);
    setTotalQuantities(0);
    runFireworks();
  }, []);

  return (
    <div className="bg-white min-h-[60vh] max-800:min-h-[69vh]">
      <div className="w-[1000px] mx-auto mt-[160px] bg-medium-gray p-[50px] rounded-[15px] flex justify-center items-center flex-col max-800:w-[370px] max-800:mt-[100px] max-800:p-5 max-800:h-[350px]">
        <p className="text-green-600 text-[40px]">
          <BsBagCheckFill />
        </p>
        <h2 className="capitalize mt-[15px] font-black text-[40px] text-dark-blue max-800:text-[17px]">Thank you for your order!</h2>
        <p className="text-base font-semibold text-center">Check your email inbox for the receipt.</p>
        <p className="text-base font-semibold text-center m-2.5 mt-[30px]">
          If you have any questions, please email
          <a className="ml-[5px] text-primary" href="mailto:order@example.com">
            order@example.com
          </a>
        </p>
        <Link href="/">
          <button type="button" width="300px" className="w-full max-w-[400px] py-2.5 px-3 rounded-[15px] border-none text-xl mt-10 uppercase bg-primary text-white cursor-pointer scale-100 transition-transform duration-500 ease-in-out hover:scale-110">
            Continue Shopping
          </button>
        </Link>
      </div>
    </div>
  )
}

export default Success
