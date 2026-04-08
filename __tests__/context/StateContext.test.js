import React from 'react';
import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { StateContext, useStateContext } from '../../context/StateContext';
import { toast } from 'react-hot-toast';

jest.mock('react-hot-toast');

// Helper component that exposes context values for testing
const TestConsumer = ({ action }) => {
  const ctx = useStateContext();
  return (
    <div>
      <span data-testid="totalPrice">{ctx.totalPrice}</span>
      <span data-testid="totalQuantities">{ctx.totalQuantities}</span>
      <span data-testid="qty">{ctx.qty}</span>
      <span data-testid="showCart">{String(ctx.showCart)}</span>
      <span data-testid="cartItems">{JSON.stringify(ctx.cartItems)}</span>
      <button data-testid="incQty" onClick={ctx.incQty}>+</button>
      <button data-testid="decQty" onClick={ctx.decQty}>-</button>
      <button data-testid="setShowCart" onClick={() => ctx.setShowCart(true)}>Show Cart</button>
      {action && action(ctx)}
    </div>
  );
};

const renderWithContext = (action) => {
  return render(
    <StateContext>
      <TestConsumer action={action} />
    </StateContext>
  );
};

const mockProduct = {
  _id: 'prod-1',
  name: 'Test Headphones',
  price: 100,
  image: [{ asset: { _ref: 'image-abc-webp' } }],
  quantity: 1,
};

const mockProduct2 = {
  _id: 'prod-2',
  name: 'Test Speaker',
  price: 50,
  image: [{ asset: { _ref: 'image-def-webp' } }],
  quantity: 1,
};

describe('StateContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ===== HAPPY PATH TESTS =====

  describe('initial state', () => {
    it('should initialize with default values', () => {
      renderWithContext();

      expect(screen.getByTestId('totalPrice')).toHaveTextContent('0');
      expect(screen.getByTestId('totalQuantities')).toHaveTextContent('0');
      expect(screen.getByTestId('qty')).toHaveTextContent('1');
      expect(screen.getByTestId('showCart')).toHaveTextContent('false');
      expect(screen.getByTestId('cartItems')).toHaveTextContent('[]');
    });
  });

  describe('incQty', () => {
    it('should increment quantity by 1', async () => {
      const user = userEvent.setup();
      renderWithContext();

      await user.click(screen.getByTestId('incQty'));
      expect(screen.getByTestId('qty')).toHaveTextContent('2');
    });

    it('should increment quantity multiple times', async () => {
      const user = userEvent.setup();
      renderWithContext();

      await user.click(screen.getByTestId('incQty'));
      await user.click(screen.getByTestId('incQty'));
      await user.click(screen.getByTestId('incQty'));
      expect(screen.getByTestId('qty')).toHaveTextContent('4');
    });
  });

  describe('decQty', () => {
    it('should decrement quantity by 1', async () => {
      const user = userEvent.setup();
      renderWithContext();

      // First increment to 2, then decrement back to 1
      await user.click(screen.getByTestId('incQty'));
      expect(screen.getByTestId('qty')).toHaveTextContent('2');
      await user.click(screen.getByTestId('decQty'));
      expect(screen.getByTestId('qty')).toHaveTextContent('1');
    });

    it('should not decrement below 1 (sad path)', async () => {
      const user = userEvent.setup();
      renderWithContext();

      // qty starts at 1, decrementing should keep it at 1
      await user.click(screen.getByTestId('decQty'));
      expect(screen.getByTestId('qty')).toHaveTextContent('1');

      await user.click(screen.getByTestId('decQty'));
      expect(screen.getByTestId('qty')).toHaveTextContent('1');
    });
  });

  describe('setShowCart', () => {
    it('should toggle showCart to true', async () => {
      const user = userEvent.setup();
      renderWithContext();

      await user.click(screen.getByTestId('setShowCart'));
      expect(screen.getByTestId('showCart')).toHaveTextContent('true');
    });
  });

  describe('onAdd', () => {
    it('should add a new product to the cart', async () => {
      const user = userEvent.setup();
      let ctxRef;
      renderWithContext((ctx) => {
        ctxRef = ctx;
        return (
          <button data-testid="addProduct" onClick={() => ctx.onAdd(mockProduct, 1)}>
            Add
          </button>
        );
      });

      await user.click(screen.getByTestId('addProduct'));

      expect(screen.getByTestId('totalPrice')).toHaveTextContent('100');
      expect(screen.getByTestId('totalQuantities')).toHaveTextContent('1');
      expect(toast.success).toHaveBeenCalled();
    });

    it('should add multiple quantities of a product', async () => {
      const user = userEvent.setup();
      renderWithContext((ctx) => (
        <button data-testid="addProduct" onClick={() => ctx.onAdd(mockProduct, 3)}>
          Add
        </button>
      ));

      await user.click(screen.getByTestId('addProduct'));

      expect(screen.getByTestId('totalPrice')).toHaveTextContent('300');
      expect(screen.getByTestId('totalQuantities')).toHaveTextContent('3');
    });

    it('should update quantity when adding an existing product', async () => {
      const user = userEvent.setup();
      renderWithContext((ctx) => (
        <>
          <button data-testid="addProduct" onClick={() => ctx.onAdd(mockProduct, 1)}>
            Add
          </button>
          <button data-testid="addAgain" onClick={() => ctx.onAdd(mockProduct, 2)}>
            Add Again
          </button>
        </>
      ));

      await user.click(screen.getByTestId('addProduct'));
      await user.click(screen.getByTestId('addAgain'));

      expect(screen.getByTestId('totalPrice')).toHaveTextContent('300');
      expect(screen.getByTestId('totalQuantities')).toHaveTextContent('3');
    });

    it('should add different products to the cart', async () => {
      const user = userEvent.setup();
      renderWithContext((ctx) => (
        <>
          <button data-testid="addProduct1" onClick={() => ctx.onAdd(mockProduct, 1)}>
            Add 1
          </button>
          <button data-testid="addProduct2" onClick={() => ctx.onAdd(mockProduct2, 1)}>
            Add 2
          </button>
        </>
      ));

      await user.click(screen.getByTestId('addProduct1'));
      await user.click(screen.getByTestId('addProduct2'));

      expect(screen.getByTestId('totalPrice')).toHaveTextContent('150');
      expect(screen.getByTestId('totalQuantities')).toHaveTextContent('2');
    });
  });

  describe('onRemove', () => {
    it('should remove a product from the cart', async () => {
      const user = userEvent.setup();
      renderWithContext((ctx) => (
        <>
          <button data-testid="addProduct" onClick={() => ctx.onAdd(mockProduct, 2)}>
            Add
          </button>
          <button data-testid="removeProduct" onClick={() => ctx.onRemove(mockProduct)}>
            Remove
          </button>
        </>
      ));

      await user.click(screen.getByTestId('addProduct'));
      expect(screen.getByTestId('totalPrice')).toHaveTextContent('200');

      await user.click(screen.getByTestId('removeProduct'));
      expect(screen.getByTestId('totalPrice')).toHaveTextContent('0');
      expect(screen.getByTestId('totalQuantities')).toHaveTextContent('0');
      expect(screen.getByTestId('cartItems')).toHaveTextContent('[]');
    });

    it('should only remove the specified product', async () => {
      const user = userEvent.setup();
      renderWithContext((ctx) => (
        <>
          <button data-testid="addProduct1" onClick={() => ctx.onAdd(mockProduct, 1)}>
            Add 1
          </button>
          <button data-testid="addProduct2" onClick={() => ctx.onAdd(mockProduct2, 1)}>
            Add 2
          </button>
          <button data-testid="removeProduct1" onClick={() => ctx.onRemove(mockProduct)}>
            Remove 1
          </button>
        </>
      ));

      await user.click(screen.getByTestId('addProduct1'));
      await user.click(screen.getByTestId('addProduct2'));
      expect(screen.getByTestId('totalPrice')).toHaveTextContent('150');

      await user.click(screen.getByTestId('removeProduct1'));
      expect(screen.getByTestId('totalPrice')).toHaveTextContent('50');
      expect(screen.getByTestId('totalQuantities')).toHaveTextContent('1');
    });
  });

  describe('toggleCartItemQuanitity', () => {
    it('should increment cart item quantity', async () => {
      const user = userEvent.setup();
      renderWithContext((ctx) => (
        <>
          <button data-testid="addProduct" onClick={() => ctx.onAdd(mockProduct, 1)}>
            Add
          </button>
          <button data-testid="incItem" onClick={() => ctx.toggleCartItemQuanitity('prod-1', 'inc')}>
            Inc
          </button>
        </>
      ));

      await user.click(screen.getByTestId('addProduct'));
      await user.click(screen.getByTestId('incItem'));

      expect(screen.getByTestId('totalPrice')).toHaveTextContent('200');
      expect(screen.getByTestId('totalQuantities')).toHaveTextContent('2');
    });

    it('should decrement cart item quantity', async () => {
      const user = userEvent.setup();
      renderWithContext((ctx) => (
        <>
          <button data-testid="addProduct" onClick={() => ctx.onAdd(mockProduct, 2)}>
            Add
          </button>
          <button data-testid="decItem" onClick={() => ctx.toggleCartItemQuanitity('prod-1', 'dec')}>
            Dec
          </button>
        </>
      ));

      await user.click(screen.getByTestId('addProduct'));
      await user.click(screen.getByTestId('decItem'));

      expect(screen.getByTestId('totalPrice')).toHaveTextContent('100');
      expect(screen.getByTestId('totalQuantities')).toHaveTextContent('1');
    });

    it('should not decrement below 1 (sad path)', async () => {
      const user = userEvent.setup();
      renderWithContext((ctx) => (
        <>
          <button data-testid="addProduct" onClick={() => ctx.onAdd(mockProduct, 1)}>
            Add
          </button>
          <button data-testid="decItem" onClick={() => ctx.toggleCartItemQuanitity('prod-1', 'dec')}>
            Dec
          </button>
        </>
      ));

      await user.click(screen.getByTestId('addProduct'));
      await user.click(screen.getByTestId('decItem'));

      // Should stay at 1, not go to 0
      expect(screen.getByTestId('totalPrice')).toHaveTextContent('100');
      expect(screen.getByTestId('totalQuantities')).toHaveTextContent('1');
    });
  });
});
