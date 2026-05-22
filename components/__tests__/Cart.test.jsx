import React from 'react';
import { render, screen, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import Cart from '../Cart';

const mockSetShowCart = jest.fn();
const mockToggle = jest.fn();
const mockOnRemove = jest.fn();

const mockContextValues = {
  totalPrice: 0,
  totalQuantities: 0,
  cartItems: [],
  setShowCart: mockSetShowCart,
  toggleCartItemQuanitity: mockToggle,
  onRemove: mockOnRemove,
  showCart: true,
  qty: 1,
  incQty: jest.fn(),
  decQty: jest.fn(),
  onAdd: jest.fn(),
  setCartItems: jest.fn(),
  setTotalPrice: jest.fn(),
  setTotalQuantities: jest.fn(),
};

jest.mock('../../context/StateContext', () => ({
  useStateContext: () => mockContextValues,
}));

jest.mock('../../lib/client', () => ({
  urlFor: jest.fn(() => ({
    toString: () => 'https://mock-image.com/product.webp',
  })),
}));

const mockRedirectToCheckout = jest.fn();
jest.mock('../../lib/getStripe', () => jest.fn(() => Promise.resolve({
  redirectToCheckout: mockRedirectToCheckout,
})));

jest.mock('react-hot-toast', () => ({
  __esModule: true,
  default: { loading: jest.fn(), success: jest.fn() },
  toast: { loading: jest.fn(), success: jest.fn() },
}));

jest.mock('react-icons/ai', () => ({
  AiOutlineMinus: () => <span>-</span>,
  AiOutlinePlus: () => <span>+</span>,
  AiOutlineLeft: () => <span>&lt;</span>,
  AiOutlineShopping: () => <span>Shop</span>,
}));

jest.mock('react-icons/ti', () => ({
  TiDeleteOutline: () => <span data-testid="delete-icon">X</span>,
}));

const cartItemsData = [
  {
    _id: '1',
    name: 'Headphones A',
    price: 100,
    quantity: 2,
    image: [{ asset: { _ref: 'image-1' } }],
  },
  {
    _id: '2',
    name: 'Earphones B',
    price: 50,
    quantity: 1,
    image: [{ asset: { _ref: 'image-2' } }],
  },
];

describe('Cart', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockContextValues.cartItems = [];
    mockContextValues.totalPrice = 0;
    mockContextValues.totalQuantities = 0;
  });

  describe('Empty cart', () => {
    it('shows empty cart message', () => {
      render(<Cart />);
      expect(screen.getByText('Your shopping bag is empty')).toBeInTheDocument();
    });

    it('shows Continue Shopping button', () => {
      render(<Cart />);
      expect(screen.getByText('Continue Shopping')).toBeInTheDocument();
    });
  });

  describe('Cart with items', () => {
    beforeEach(() => {
      mockContextValues.cartItems = cartItemsData;
      mockContextValues.totalPrice = 250;
      mockContextValues.totalQuantities = 3;
    });

    it('renders each item name', () => {
      render(<Cart />);
      expect(screen.getByText('Headphones A')).toBeInTheDocument();
      expect(screen.getByText('Earphones B')).toBeInTheDocument();
    });

    it('renders item prices', () => {
      render(<Cart />);
      expect(screen.getByText('$100')).toBeInTheDocument();
      expect(screen.getByText('$50')).toBeInTheDocument();
    });

    it('renders item quantities', () => {
      render(<Cart />);
      expect(screen.getByText('2')).toBeInTheDocument();
    });

    it('clicking + calls toggleCartItemQuanitity with inc', () => {
      render(<Cart />);
      const plusButtons = screen.getAllByText('+');
      act(() => { plusButtons[0].click(); });
      expect(mockToggle).toHaveBeenCalledWith('1', 'inc');
    });

    it('clicking - calls toggleCartItemQuanitity with dec', () => {
      render(<Cart />);
      const minusButtons = screen.getAllByText('-');
      act(() => { minusButtons[0].click(); });
      expect(mockToggle).toHaveBeenCalledWith('1', 'dec');
    });

    it('clicking remove calls onRemove', () => {
      render(<Cart />);
      const removeButtons = screen.getAllByTestId('delete-icon');
      act(() => { removeButtons[0].closest('button').click(); });
      expect(mockOnRemove).toHaveBeenCalledWith(cartItemsData[0]);
    });

    it('renders subtotal', () => {
      render(<Cart />);
      expect(screen.getByText('$250')).toBeInTheDocument();
    });

    it('clicking Pay with Stripe triggers handleCheckout', async () => {
      global.fetch = jest.fn(() =>
        Promise.resolve({
          statusCode: 200,
          json: () => Promise.resolve({ id: 'session_123' }),
        })
      );

      render(<Cart />);
      const payButton = screen.getByText('Pay with Stripe');

      await act(async () => { payButton.click(); });

      expect(global.fetch).toHaveBeenCalledWith('/api/stripe', expect.objectContaining({
        method: 'POST',
      }));
    });
  });
});
