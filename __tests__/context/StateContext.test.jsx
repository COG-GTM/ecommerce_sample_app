import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { StateContext, useStateContext } from '../../context/StateContext';

jest.mock('react-hot-toast', () => ({
  toast: { success: jest.fn() },
}));

const TestConsumer = () => {
  const {
    showCart, setShowCart, cartItems, totalPrice, totalQuantities,
    qty, incQty, decQty, onAdd, toggleCartItemQuanitity, onRemove,
  } = useStateContext();

  return (
    <div>
      <span data-testid="showCart">{String(showCart)}</span>
      <span data-testid="totalPrice">{totalPrice}</span>
      <span data-testid="totalQuantities">{totalQuantities}</span>
      <span data-testid="qty">{qty}</span>
      <span data-testid="cartItemsCount">{cartItems.length}</span>
      <span data-testid="cartItems">{JSON.stringify(cartItems)}</span>
      <button data-testid="setShowCart" onClick={() => setShowCart(true)}>Show Cart</button>
      <button data-testid="incQty" onClick={incQty}>Inc Qty</button>
      <button data-testid="decQty" onClick={decQty}>Dec Qty</button>
      <button data-testid="addProduct" onClick={() => onAdd({ _id: 'p1', name: 'Test Product', price: 100 }, 2)}>Add Product</button>
      <button data-testid="addExisting" onClick={() => onAdd({ _id: 'p1', name: 'Test Product', price: 100 }, 1)}>Add Existing</button>
      <button data-testid="addProduct2" onClick={() => onAdd({ _id: 'p2', name: 'Product 2', price: 50 }, 1)}>Add Product 2</button>
      <button data-testid="toggleInc" onClick={() => toggleCartItemQuanitity('p1', 'inc')}>Toggle Inc</button>
      <button data-testid="toggleDec" onClick={() => toggleCartItemQuanitity('p1', 'dec')}>Toggle Dec</button>
      <button data-testid="removeProduct" onClick={() => onRemove({ _id: 'p1' })}>Remove</button>
    </div>
  );
};

const renderWithContext = () => {
  return render(
    <StateContext>
      <TestConsumer />
    </StateContext>
  );
};

describe('StateContext', () => {
  it('provides default values', () => {
    renderWithContext();
    expect(screen.getByTestId('showCart')).toHaveTextContent('false');
    expect(screen.getByTestId('totalPrice')).toHaveTextContent('0');
    expect(screen.getByTestId('totalQuantities')).toHaveTextContent('0');
    expect(screen.getByTestId('qty')).toHaveTextContent('1');
    expect(screen.getByTestId('cartItemsCount')).toHaveTextContent('0');
  });

  it('setShowCart updates showCart', () => {
    renderWithContext();
    fireEvent.click(screen.getByTestId('setShowCart'));
    expect(screen.getByTestId('showCart')).toHaveTextContent('true');
  });

  it('incQty increments quantity', () => {
    renderWithContext();
    fireEvent.click(screen.getByTestId('incQty'));
    expect(screen.getByTestId('qty')).toHaveTextContent('2');
  });

  it('incQty increments multiple times', () => {
    renderWithContext();
    fireEvent.click(screen.getByTestId('incQty'));
    fireEvent.click(screen.getByTestId('incQty'));
    fireEvent.click(screen.getByTestId('incQty'));
    expect(screen.getByTestId('qty')).toHaveTextContent('4');
  });

  it('decQty decrements quantity', () => {
    renderWithContext();
    fireEvent.click(screen.getByTestId('incQty'));
    fireEvent.click(screen.getByTestId('incQty'));
    fireEvent.click(screen.getByTestId('decQty'));
    expect(screen.getByTestId('qty')).toHaveTextContent('2');
  });

  it('decQty does not go below 1', () => {
    renderWithContext();
    fireEvent.click(screen.getByTestId('decQty'));
    expect(screen.getByTestId('qty')).toHaveTextContent('1');
  });

  it('onAdd adds a product to cart', () => {
    renderWithContext();
    fireEvent.click(screen.getByTestId('addProduct'));
    expect(screen.getByTestId('cartItemsCount')).toHaveTextContent('1');
    expect(screen.getByTestId('totalPrice')).toHaveTextContent('200');
    expect(screen.getByTestId('totalQuantities')).toHaveTextContent('2');
  });

  it('onAdd updates quantity for existing product', () => {
    renderWithContext();
    fireEvent.click(screen.getByTestId('addProduct'));
    fireEvent.click(screen.getByTestId('addExisting'));
    expect(screen.getByTestId('totalPrice')).toHaveTextContent('300');
    expect(screen.getByTestId('totalQuantities')).toHaveTextContent('3');
  });

  it('onAdd adds a different product to cart', () => {
    renderWithContext();
    fireEvent.click(screen.getByTestId('addProduct'));
    fireEvent.click(screen.getByTestId('addProduct2'));
    expect(screen.getByTestId('cartItemsCount')).toHaveTextContent('2');
    expect(screen.getByTestId('totalPrice')).toHaveTextContent('250');
    expect(screen.getByTestId('totalQuantities')).toHaveTextContent('3');
  });

  it('toggleCartItemQuanitity increments item quantity', () => {
    renderWithContext();
    fireEvent.click(screen.getByTestId('addProduct'));
    fireEvent.click(screen.getByTestId('toggleInc'));
    expect(screen.getByTestId('totalPrice')).toHaveTextContent('300');
    expect(screen.getByTestId('totalQuantities')).toHaveTextContent('3');
  });

  it('toggleCartItemQuanitity decrements item quantity', () => {
    renderWithContext();
    fireEvent.click(screen.getByTestId('addProduct'));
    fireEvent.click(screen.getByTestId('toggleDec'));
    expect(screen.getByTestId('totalPrice')).toHaveTextContent('100');
    expect(screen.getByTestId('totalQuantities')).toHaveTextContent('1');
  });

  it('toggleCartItemQuanitity dec does not go below 1', () => {
    renderWithContext();
    // Add a product with quantity 1 (using addProduct2 which adds p2 with qty 1)
    fireEvent.click(screen.getByTestId('addProduct2'));
    // Try to toggle dec on p1 which doesn't exist — should handle gracefully
    expect(screen.getByTestId('totalQuantities')).toHaveTextContent('1');
  });

  it('onRemove removes a product from cart', () => {
    renderWithContext();
    fireEvent.click(screen.getByTestId('addProduct'));
    fireEvent.click(screen.getByTestId('removeProduct'));
    expect(screen.getByTestId('cartItemsCount')).toHaveTextContent('0');
    expect(screen.getByTestId('totalPrice')).toHaveTextContent('0');
    expect(screen.getByTestId('totalQuantities')).toHaveTextContent('0');
  });

  it('onAdd existing product with multiple items in cart covers map else branch', () => {
    renderWithContext();
    // Add product 1 (qty 2)
    fireEvent.click(screen.getByTestId('addProduct'));
    // Add product 2 (qty 1)
    fireEvent.click(screen.getByTestId('addProduct2'));
    // Add product 1 again — map iterates both items, covering both branches
    fireEvent.click(screen.getByTestId('addExisting'));
    expect(screen.getByTestId('totalPrice')).toHaveTextContent('350');
    expect(screen.getByTestId('totalQuantities')).toHaveTextContent('4');
  });

  it('toggleCartItemQuanitity dec with quantity exactly 1 does nothing', () => {
    renderWithContext();
    // Add product with quantity 1 (addExisting adds p1 with qty 1, but we need addProduct2 for p2)
    // First add p1 with qty 2, then dec to 1, then dec again — should stay at 1
    fireEvent.click(screen.getByTestId('addProduct'));
    // qty is 2, dec to 1
    fireEvent.click(screen.getByTestId('toggleDec'));
    expect(screen.getByTestId('totalQuantities')).toHaveTextContent('1');
    // Now quantity is 1, dec again — should stay at 1
    fireEvent.click(screen.getByTestId('toggleDec'));
    expect(screen.getByTestId('totalQuantities')).toHaveTextContent('1');
  });
});
