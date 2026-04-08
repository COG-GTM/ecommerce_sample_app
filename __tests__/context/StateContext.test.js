import React from 'react';
import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { StateContext, useStateContext } from '../../context/StateContext';

// Mock react-hot-toast
jest.mock('react-hot-toast', () => ({
  toast: { success: jest.fn(), loading: jest.fn() },
  success: jest.fn(),
}));

// Helper component that exposes context values for testing
function TestConsumer({ onRender }) {
  const ctx = useStateContext();
  onRender(ctx);
  return (
    <div>
      <span data-testid="qty">{ctx.qty}</span>
      <span data-testid="totalPrice">{ctx.totalPrice}</span>
      <span data-testid="totalQuantities">{ctx.totalQuantities}</span>
      <span data-testid="cartCount">{ctx.cartItems.length}</span>
      <span data-testid="showCart">{ctx.showCart.toString()}</span>
    </div>
  );
}

function renderWithContext(onRender = jest.fn()) {
  return render(
    <StateContext>
      <TestConsumer onRender={onRender} />
    </StateContext>
  );
}

// Interactive helper that provides buttons to trigger actions
function InteractiveConsumer() {
  const ctx = useStateContext();
  return (
    <div>
      <span data-testid="qty">{ctx.qty}</span>
      <span data-testid="totalPrice">{ctx.totalPrice}</span>
      <span data-testid="totalQuantities">{ctx.totalQuantities}</span>
      <span data-testid="cartCount">{ctx.cartItems.length}</span>
      <span data-testid="showCart">{ctx.showCart.toString()}</span>
      <span data-testid="cartItems">{JSON.stringify(ctx.cartItems)}</span>
      <button data-testid="incQty" onClick={ctx.incQty}>+</button>
      <button data-testid="decQty" onClick={ctx.decQty}>-</button>
      <button
        data-testid="addProduct"
        onClick={() =>
          ctx.onAdd({ _id: 'p1', name: 'Headphones', price: 100, image: [] }, ctx.qty)
        }
      >
        Add
      </button>
      <button
        data-testid="addProduct2"
        onClick={() =>
          ctx.onAdd({ _id: 'p2', name: 'Speaker', price: 200, image: [] }, 1)
        }
      >
        Add2
      </button>
      <button
        data-testid="removeProduct"
        onClick={() => ctx.onRemove({ _id: 'p1' })}
      >
        Remove
      </button>
      <button
        data-testid="incCartItem"
        onClick={() => ctx.toggleCartItemQuanitity('p1', 'inc')}
      >
        IncCart
      </button>
      <button
        data-testid="decCartItem"
        onClick={() => ctx.toggleCartItemQuanitity('p1', 'dec')}
      >
        DecCart
      </button>
      <button
        data-testid="toggleCart"
        onClick={() => ctx.setShowCart(true)}
      >
        ShowCart
      </button>
    </div>
  );
}

function renderInteractive() {
  return render(
    <StateContext>
      <InteractiveConsumer />
    </StateContext>
  );
}

describe('StateContext', () => {
  describe('Initial state', () => {
    it('should provide default values', () => {
      const onRender = jest.fn();
      renderWithContext(onRender);

      expect(screen.getByTestId('qty')).toHaveTextContent('1');
      expect(screen.getByTestId('totalPrice')).toHaveTextContent('0');
      expect(screen.getByTestId('totalQuantities')).toHaveTextContent('0');
      expect(screen.getByTestId('cartCount')).toHaveTextContent('0');
      expect(screen.getByTestId('showCart')).toHaveTextContent('false');
    });
  });

  describe('incQty', () => {
    it('should increment quantity by 1', async () => {
      renderInteractive();
      const user = userEvent.setup();

      expect(screen.getByTestId('qty')).toHaveTextContent('1');
      await user.click(screen.getByTestId('incQty'));
      expect(screen.getByTestId('qty')).toHaveTextContent('2');
      await user.click(screen.getByTestId('incQty'));
      expect(screen.getByTestId('qty')).toHaveTextContent('3');
    });
  });

  describe('decQty', () => {
    it('should decrement quantity by 1', async () => {
      renderInteractive();
      const user = userEvent.setup();

      // First increment to 3
      await user.click(screen.getByTestId('incQty'));
      await user.click(screen.getByTestId('incQty'));
      expect(screen.getByTestId('qty')).toHaveTextContent('3');

      await user.click(screen.getByTestId('decQty'));
      expect(screen.getByTestId('qty')).toHaveTextContent('2');
    });

    it('should not go below 1 (sad path)', async () => {
      renderInteractive();
      const user = userEvent.setup();

      expect(screen.getByTestId('qty')).toHaveTextContent('1');
      await user.click(screen.getByTestId('decQty'));
      expect(screen.getByTestId('qty')).toHaveTextContent('1');
      // Click again to confirm it stays at 1
      await user.click(screen.getByTestId('decQty'));
      expect(screen.getByTestId('qty')).toHaveTextContent('1');
    });
  });

  describe('onAdd', () => {
    it('should add a new product to cart (happy path)', async () => {
      renderInteractive();
      const user = userEvent.setup();

      await user.click(screen.getByTestId('addProduct'));

      expect(screen.getByTestId('cartCount')).toHaveTextContent('1');
      expect(screen.getByTestId('totalPrice')).toHaveTextContent('100');
      expect(screen.getByTestId('totalQuantities')).toHaveTextContent('1');
    });

    it('should increase quantity when adding an existing product', async () => {
      renderInteractive();
      const user = userEvent.setup();

      await user.click(screen.getByTestId('addProduct'));
      expect(screen.getByTestId('totalQuantities')).toHaveTextContent('1');

      await user.click(screen.getByTestId('addProduct'));
      expect(screen.getByTestId('totalPrice')).toHaveTextContent('200');
      expect(screen.getByTestId('totalQuantities')).toHaveTextContent('2');
    });

    it('should add multiple different products', async () => {
      renderInteractive();
      const user = userEvent.setup();

      await user.click(screen.getByTestId('addProduct'));
      await user.click(screen.getByTestId('addProduct2'));

      expect(screen.getByTestId('cartCount')).toHaveTextContent('2');
      expect(screen.getByTestId('totalPrice')).toHaveTextContent('300');
      expect(screen.getByTestId('totalQuantities')).toHaveTextContent('2');
    });

    it('should add with increased qty selector value', async () => {
      renderInteractive();
      const user = userEvent.setup();

      await user.click(screen.getByTestId('incQty'));
      await user.click(screen.getByTestId('incQty'));
      // qty is now 3
      await user.click(screen.getByTestId('addProduct'));

      expect(screen.getByTestId('totalPrice')).toHaveTextContent('300');
      expect(screen.getByTestId('totalQuantities')).toHaveTextContent('3');
    });
  });

  describe('onRemove', () => {
    it('should remove a product from the cart (happy path)', async () => {
      renderInteractive();
      const user = userEvent.setup();

      await user.click(screen.getByTestId('addProduct'));
      expect(screen.getByTestId('cartCount')).toHaveTextContent('1');

      await user.click(screen.getByTestId('removeProduct'));
      expect(screen.getByTestId('cartCount')).toHaveTextContent('0');
      expect(screen.getByTestId('totalPrice')).toHaveTextContent('0');
      expect(screen.getByTestId('totalQuantities')).toHaveTextContent('0');
    });

    it('should only remove the targeted product, not others', async () => {
      renderInteractive();
      const user = userEvent.setup();

      await user.click(screen.getByTestId('addProduct'));
      await user.click(screen.getByTestId('addProduct2'));
      expect(screen.getByTestId('cartCount')).toHaveTextContent('2');

      await user.click(screen.getByTestId('removeProduct')); // removes p1
      expect(screen.getByTestId('cartCount')).toHaveTextContent('1');
      expect(screen.getByTestId('totalPrice')).toHaveTextContent('200');
      expect(screen.getByTestId('totalQuantities')).toHaveTextContent('1');
    });
  });

  describe('toggleCartItemQuanitity', () => {
    it('should increment a cart item quantity (happy path)', async () => {
      renderInteractive();
      const user = userEvent.setup();

      await user.click(screen.getByTestId('addProduct'));
      expect(screen.getByTestId('totalQuantities')).toHaveTextContent('1');

      await user.click(screen.getByTestId('incCartItem'));
      expect(screen.getByTestId('totalQuantities')).toHaveTextContent('2');
      expect(screen.getByTestId('totalPrice')).toHaveTextContent('200');
    });

    it('should decrement a cart item quantity when quantity > 1', async () => {
      renderInteractive();
      const user = userEvent.setup();

      // Add product then increment so quantity = 2
      await user.click(screen.getByTestId('addProduct'));
      await user.click(screen.getByTestId('incCartItem'));
      expect(screen.getByTestId('totalQuantities')).toHaveTextContent('2');

      await user.click(screen.getByTestId('decCartItem'));
      expect(screen.getByTestId('totalQuantities')).toHaveTextContent('1');
      expect(screen.getByTestId('totalPrice')).toHaveTextContent('100');
    });

    it('should not decrement below 1 (sad path)', async () => {
      renderInteractive();
      const user = userEvent.setup();

      await user.click(screen.getByTestId('addProduct'));
      expect(screen.getByTestId('totalQuantities')).toHaveTextContent('1');

      await user.click(screen.getByTestId('decCartItem'));
      // Should stay at 1, not go to 0
      expect(screen.getByTestId('totalQuantities')).toHaveTextContent('1');
      expect(screen.getByTestId('totalPrice')).toHaveTextContent('100');
    });
  });

  describe('setShowCart', () => {
    it('should toggle cart visibility', async () => {
      renderInteractive();
      const user = userEvent.setup();

      expect(screen.getByTestId('showCart')).toHaveTextContent('false');
      await user.click(screen.getByTestId('toggleCart'));
      expect(screen.getByTestId('showCart')).toHaveTextContent('true');
    });
  });
});
