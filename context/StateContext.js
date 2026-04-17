import React from 'react';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { toast } from 'react-hot-toast';

const useCartStore = create(
  persist(
    (set, get) => ({
      showCart: false,
      cartItems: [],
      qty: 1,

      setShowCart: (value) => set({ showCart: value }),

      onAdd: (product, quantity) => {
        const { cartItems } = get();
        const checkProductInCart = cartItems.find(
          (item) => item._id === product._id
        );

        if (checkProductInCart) {
          const updatedCartItems = cartItems.map((cartProduct) => {
            if (cartProduct._id === product._id) {
              return {
                ...cartProduct,
                quantity: cartProduct.quantity + quantity,
              };
            }
            return cartProduct;
          });

          set({ cartItems: updatedCartItems });
        } else {
          set({
            cartItems: [...cartItems, { ...product, quantity }],
          });
        }

        toast.success(`${quantity} ${product.name} added to the cart.`);
      },

      onRemove: (product) => {
        const { cartItems } = get();
        const newCartItems = cartItems.filter(
          (item) => item._id !== product._id
        );
        set({ cartItems: newCartItems });
      },

      toggleCartItemQuantity: (id, value) => {
        const { cartItems } = get();
        const updatedCartItems = cartItems.map((item) => {
          if (item._id === id) {
            if (value === 'inc') {
              return { ...item, quantity: item.quantity + 1 };
            } else if (value === 'dec' && item.quantity > 1) {
              return { ...item, quantity: item.quantity - 1 };
            }
          }
          return item;
        });
        set({ cartItems: updatedCartItems });
      },

      incQty: () => set((state) => ({ qty: state.qty + 1 })),

      decQty: () =>
        set((state) => ({ qty: state.qty - 1 < 1 ? 1 : state.qty - 1 })),

      clearCart: () => set({ cartItems: [], qty: 1 }),
    }),
    {
      name: 'cart-storage',
      partialize: (state) => ({ cartItems: state.cartItems }),
    }
  )
);

export const useStateContext = () => {
  const store = useCartStore();
  const totalPrice = useCartStore((state) =>
    state.cartItems.reduce((total, item) => total + item.price * item.quantity, 0)
  );
  const totalQuantities = useCartStore((state) =>
    state.cartItems.reduce((total, item) => total + item.quantity, 0)
  );

  return {
    ...store,
    totalPrice,
    totalQuantities,
  };
};

// Keep StateContext wrapper for backward compatibility with _app.js
export const StateContext = ({ children }) => {
  return <>{children}</>;
};

export default useCartStore;
