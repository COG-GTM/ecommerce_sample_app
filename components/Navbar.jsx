import React from 'react';
import Link from 'next/link';
import { AiOutlineShopping } from 'react-icons/ai'

import { Cart } from './';
import { useStateContext} from '../context/StateContext';

const Navbar = () => {
  const { showCart, setShowCart, totalQuantities } = useStateContext();

  return (
    <div className="flex justify-between m-1.5 mx-[18px] relative">
      <p className="text-[gray] text-lg">
        <Link href="/">JSM Headphones</Link>
      </p>

      <button type="button" className="text-[25px] text-[gray] cursor-pointer relative transition-transform duration-[400ms] ease-in-out border-none bg-transparent hover:scale-110" onClick={() => setShowCart(true)}>
        <AiOutlineShopping />
        <span className="absolute -right-2 text-xs text-[#eee] bg-primary w-[18px] h-[18px] rounded-full text-center font-semibold">{totalQuantities}</span>
      </button>

      {showCart && <Cart />}
    </div>
  )
}

export default Navbar
