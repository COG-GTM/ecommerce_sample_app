import React from 'react';
import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { StateContext, useStateContext } from '../StateContext';

jest.mock('react-hot-toast', () => ({
  toast: { success: jest.fn() },
  success: jest.fn(),
}));

const TestComponent = () => {
  const {
    showCart, setShowCart, cartItems, totalPrice, totalQuantities,
    qty, incQty, decQty, onAdd, toggleCartItemQuanitity, onRemove,
    setCartItems, setTotalPrice, setTotalQuantities,
  } = useStateContext();

  return (
    <div>
      <span data-testid="showCart">{String(showCart)}</span>
      <span data-testid="totalPrice">{totalPrice}</span>
      <span data-testid="totalQuantities">{totalQuantities}</span>
      <span data-testid="qty">{qty}</span>
      <span data-testid="cartItems">{JSON.stringify(cartItems)}</span>

      <button data-testid="incQty" onClick={incQty}>incQty</button>
      <button data-testid="decQty" onClick={decQty}>decQty</button>
      <button data-testid="setShowCart" onClick={() => setShowCart(true)}>openCart</button>

      <button data-testid="addProduct1" onClick={() => onAdd({ _id: '1', name: 'Product A', price: 25 }, 2)}>
        Add Product 1
      </button>
      <button data-testid="addProduct1Again" onClick={() => onAdd({ _id: '1', name: 'Product A', price: 25 }, 3)}>
        Add Product 1 Again
      </button>
      <button data-testid="addProduct2" onClick={() => onAdd({ _id: '2', name: 'Product B', price: 50 }, 1)}>
        Add Product 2
      </button>
      <button data-testid="removeProduct1" onClick={() => onRemove({ _id: '1' })}>
        Remove Product 1
      </button>
      <button data-testid="incItem1" onClick={() => toggleCartItemQuanitity('1', 'inc')}>
        Inc Item 1
      </button>
      <button data-testid="decItem1" onClick={() => toggleCartItemQuanitity('1', 'dec')}>
        Dec Item 1
      </button>
      <button data-testid="resetCart" onClick={() => { setCartItems([]); setTotalPrice(0); setTotalQuantities(0); }}>
        Reset
      </button>
    </div>
  );
};

const renderWithContext = () => render(
  <StateContext>
    <TestComponent />
  </StateContext>
);

describe('StateContext', () => {
  describe('incQty / decQty', () => {
    it('incQty increases qty by 1', () => {
      renderWithContext();
      expect(screen.getByTestId('qty')).toHaveTextContent('1');
      act(() => { screen.getByTestId('incQty').click(); });
      expect(screen.getByTestId('qty')).toHaveTextContent('2');
    });

    it('decQty decreases qty by 1', () => {
      renderWithContext();
      act(() => { screen.getByTestId('incQty').click(); });
      act(() => { screen.getByTestId('incQty').click(); });
      expect(screen.getByTestId('qty')).toHaveTextContent('3');
      act(() => { screen.getByTestId('decQty').click(); });
      expect(screen.getByTestId('qty')).toHaveTextContent('2');
    });

    it('decQty cannot go below 1', () => {
      renderWithContext();
      expect(screen.getByTestId('qty')).toHaveTextContent('1');
      act(() => { screen.getByTestId('decQty').click(); });
      expect(screen.getByTestId('qty')).toHaveTextContent('1');
    });
  });

  describe('onAdd', () => {
    it('adds a new product to cart', () => {
      renderWithContext();
      act(() => { screen.getByTestId('addProduct1').click(); });
      expect(screen.getByTestId('totalPrice')).toHaveTextContent('50');
      expect(screen.getByTestId('totalQuantities')).toHaveTextContent('2');
      const items = JSON.parse(screen.getByTestId('cartItems').textContent);
      expect(items).toHaveLength(1);
      expect(items[0]._id).toBe('1');
      expect(items[0].quantity).toBe(2);
    });

    it('accumulates quantity when adding existing product', () => {
      renderWithContext();
      act(() => { screen.getByTestId('addProduct1').click(); });
      act(() => { screen.getByTestId('addProduct1Again').click(); });
      expect(screen.getByTestId('totalPrice')).toHaveTextContent('125');
      expect(screen.getByTestId('totalQuantities')).toHaveTextContent('5');
    });
  });

  describe('onRemove', () => {
    it('removes a product and updates totals', () => {
      renderWithContext();
      act(() => { screen.getByTestId('addProduct1').click(); });
      act(() => { screen.getByTestId('addProduct2').click(); });
      expect(screen.getByTestId('totalQuantities')).toHaveTextContent('3');
      act(() => { screen.getByTestId('removeProduct1').click(); });
      expect(screen.getByTestId('totalPrice')).toHaveTextContent('50');
      expect(screen.getByTestId('totalQuantities')).toHaveTextContent('1');
    });
  });

  describe('toggleCartItemQuanitity', () => {
    it('increments item quantity', () => {
      renderWithContext();
      act(() => { screen.getByTestId('addProduct1').click(); });
      act(() => { screen.getByTestId('incItem1').click(); });
      expect(screen.getByTestId('totalPrice')).toHaveTextContent('75');
      expect(screen.getByTestId('totalQuantities')).toHaveTextContent('3');
    });

    it('decrements item quantity', () => {
      renderWithContext();
      act(() => { screen.getByTestId('addProduct1').click(); });
      act(() => { screen.getByTestId('decItem1').click(); });
      expect(screen.getByTestId('totalPrice')).toHaveTextContent('25');
      expect(screen.getByTestId('totalQuantities')).toHaveTextContent('1');
    });

    it('does not decrement below 1', () => {
      renderWithContext();
      // Add product 1 with qty 1 (via the button that adds qty=2, then dec once to get to qty=1 in cart)
      act(() => { screen.getByTestId('addProduct1').click(); }); // qty=2
      act(() => { screen.getByTestId('decItem1').click(); }); // qty=1
      act(() => { screen.getByTestId('decItem1').click(); }); // should stay at 1
      expect(screen.getByTestId('totalQuantities')).toHaveTextContent('1');
      expect(screen.getByTestId('totalPrice')).toHaveTextContent('25');
    });
  });

  describe('setShowCart', () => {
    it('sets showCart to true', () => {
      renderWithContext();
      expect(screen.getByTestId('showCart')).toHaveTextContent('false');
      act(() => { screen.getByTestId('setShowCart').click(); });
      expect(screen.getByTestId('showCart')).toHaveTextContent('true');
    });
  });

  describe('reset functions', () => {
    it('resets cart state', () => {
      renderWithContext();
      act(() => { screen.getByTestId('addProduct1').click(); });
      act(() => { screen.getByTestId('resetCart').click(); });
      expect(screen.getByTestId('totalPrice')).toHaveTextContent('0');
      expect(screen.getByTestId('totalQuantities')).toHaveTextContent('0');
      expect(screen.getByTestId('cartItems')).toHaveTextContent('[]');
    });
  });
});
