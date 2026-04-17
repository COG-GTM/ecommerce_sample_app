'use client';

import { Toaster } from 'react-hot-toast';
import { StateContext } from '../context/StateContext';

export default function Providers({ children }) {
  return (
    <StateContext>
      <Toaster />
      {children}
    </StateContext>
  );
}
