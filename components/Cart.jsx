import React, { useRef } from 'react';
import Link from 'next/link';
import { AiOutlineMinus, AiOutlinePlus, AiOutlineLeft, AiOutlineShopping } from 'react-icons/ai';
import { TiDeleteOutline } from 'react-icons/ti';
import toast from 'react-hot-toast';

import { useStateContext } from '../context/StateContext';
import { urlFor } from '../lib/client';
import getStripe from '../lib/getStripe';

const Cart = () => {
  const cartRef = useRef();
  const { totalPrice, totalQuantities, cartItems, setShowCart, toggleCartItemQuanitity, onRemove } = useStateContext();

  const handleCheckout = async () => {
    const stripe = await getStripe();

    const response = await fetch('/api/stripe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(cartItems),
    });

    if(response.statusCode === 500) return;
    
    const data = await response.json();

    toast.loading('Redirecting...');

    stripe.redirectToCheckout({ sessionId: data.id });
  }

  return (
    <div className="w-screen bg-black/50 fixed right-0 top-0 z-[100] transition-all duration-1000 ease-in-out" ref={cartRef}>
      <div className="h-screen w-[600px] bg-white float-right py-10 px-2.5 relative max-800:w-[415px] max-800:p-1">
        <button
        type="button"
        className="flex items-center text-lg font-medium cursor-pointer gap-0.5 ml-2.5 border-none bg-transparent max-800:mt-[35px]"
        onClick={() => setShowCart(false)}>
          <AiOutlineLeft />
          <span className="ml-2.5">Your Cart</span>
          <span className="ml-2.5 text-primary">({totalQuantities} items)</span>
        </button>

        {cartItems.length < 1 && (
          <div className="m-10 text-center">
            <AiOutlineShopping size={150} />
            <h3 className="font-semibold text-xl">Your shopping bag is empty</h3>
            <Link href="/">
              <button
                type="button"
                onClick={() => setShowCart(false)}
                className="w-full max-w-[400px] py-2.5 px-3 rounded-[15px] border-none text-xl mt-10 uppercase bg-primary text-white cursor-pointer scale-100 transition-transform duration-500 ease-in-out hover:scale-110"
              >
                Continue Shopping
              </button>
            </Link>
          </div>
        )}

        <div className="mt-[15px] overflow-auto max-h-[70vh] py-5 px-2.5 max-800:mt-2.5">
          {cartItems.length >= 1 && cartItems.map((item) => (
            <div className="flex gap-[30px] p-5 max-800:py-5 max-800:px-[5px]" key={item._id}>
              <img src={urlFor(item?.image[0])} className="w-[180px] h-[150px] rounded-[15px] bg-light-gray max-800:w-1/4 max-800:h-1/4" />
              <div>
                <div className="flex justify-between w-[350px] text-dark-blue max-800:w-[200px] max-800:flex-wrap max-800:gap-2.5">
                  <h5 className="text-2xl max-800:text-base max-800:text-dark-blue">{item.name}</h5>
                  <h4 className="text-xl max-800:text-base max-800:text-black">${item.price}</h4>
                </div>
                <div className="flex justify-between w-[350px] text-dark-blue mt-[60px] max-800:w-[200px] max-800:mt-[30px]">
                  <div>
                                    <p className="border border-[gray] p-1.5">
                                      <span className="text-base py-1.5 px-3 cursor-pointer border-r border-[gray] text-primary" onClick={() => toggleCartItemQuanitity(item._id, 'dec') }>
                                      <AiOutlineMinus />
                                      </span>
                                      <span className="text-xl py-1.5 px-3 cursor-pointer border-r border-[gray]" onClick="">{item.quantity}</span>
                    <span className="text-base py-1.5 px-3 cursor-pointer text-qty-green" onClick={() => toggleCartItemQuanitity(item._id, 'inc') }><AiOutlinePlus /></span>
                  </p>
                  </div>
                  <button
                    type="button"
                    className="text-2xl text-primary cursor-pointer bg-transparent border-none"
                    onClick={() => onRemove(item)}
                  >
                    <TiDeleteOutline />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        {cartItems.length >= 1 && (
          <div className="absolute bottom-3 right-[5px] w-full py-[30px] px-[65px] max-800:px-[30px]">
            <div className="flex justify-between">
              <h3 className="text-[22px] max-800:text-xl">Subtotal:</h3>
              <h3 className="text-[22px] max-800:text-xl">${totalPrice}</h3>
            </div>
            <div className="w-[400px] mx-auto max-800:w-[300px]">
              <button type="button" className="w-full max-w-[400px] py-2.5 px-3 rounded-[15px] border-none text-xl mt-10 uppercase bg-primary text-white cursor-pointer scale-100 transition-transform duration-500 ease-in-out hover:scale-110" onClick={handleCheckout}>
                Pay with Stripe
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Cart
