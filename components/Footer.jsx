import React from 'react';
import { AiFillInstagram, AiOutlineTwitter} from 'react-icons/ai';

const Footer = () => {
  return (
    <div className="text-dark-blue text-center mt-5 py-[30px] px-2.5 font-bold flex flex-col items-center gap-2.5 justify-center">
      <p>2022 JSM Headphones All rights reserverd</p>
      <p className="text-[30px] flex gap-2.5">
        <AiFillInstagram />
        <AiOutlineTwitter />
      </p>
    </div>
  )
}

export default Footer
