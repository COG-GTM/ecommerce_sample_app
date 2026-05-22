import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Cart from '../../components/Cart';

jest.mock('next/link', () => {
  return ({ children, href }) => <a href={href}>{children}</a>;
});

jest.mock('react-icons/ai', () => ({
  AiOutlineMinus: () => <span data-testid="minus-icon" />,
  AiOutlinePlus: () => <span data-testid="plus-icon" />,
  AiOutlineLeft: () => <span data-testid="left-icon" />,
  AiOutlineShopping: () => <span data-testid="shopping-icon" />,
}));

jest.mock('react-icons/ti', () => ({
  TiDeleteOutline: () => <span data-testid="delete-icon" />,
}));

jest.mock('react-hot-toast', () => ({
  __esModule: true,
  default: { loading: jest.fn() },
}));

jest.mock('../../lib/client', () => ({
  urlFor: jest.fn((source) => `https://cdn.sanity.io/mock-image/${source}`),
}));

const mockRedirectToCheckout = jest.fn();
jest.mock('../../lib/getStripe', () => {
  return jest.fn(() => Promise.resolve({ redirectToCheckout: mockRedirectToCheckout }));
});

const mockSetShowCart = jest.fn();
const mockToggleCartItemQuanitity = jest.fn();
const mockOnRemove = jest.fn();

const mockContextValues = {
  totalPrice: 500,
  totalQuantities: 2,
  cartItems: [],
  setShowCart: mockSetShowCart,
  toggleCartItemQuanitity: mockToggleCartItemQuanitity,
  onRemove: mockOnRemove,
};

jest.mock('../../context/StateContext', () => ({
  useStateContext: () => mockContextValues,
}));

const mockCartItems = [
  {
    _id: '1',
    name: 'Headphones',
    price: 250,
    quantity: 1,
    image: [{ asset: { _ref: 'image-ref-1' } }],
  },
  {
    _id: '2',
    name: 'Speaker',
    price: 250,
    quantity: 1,
    image: [{ asset: { _ref: 'image-ref-2' } }],
  },
];

describe('Cart', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockContextValues.cartItems = [];
    global.fetch = jest.fn();
  });

  afterEach(() => {
    delete global.fetch;
  });

  it('renders the cart heading with total quantities', () => {
    render(<Cart />);
    expect(screen.getByText('Your Cart')).toBeInTheDocument();
    expect(screen.getByText('(2 items)')).toBeInTheDocument();
  });

  it('shows empty cart message when no items', () => {
    render(<Cart />);
    expect(screen.getByText('Your shopping bag is empty')).toBeInTheDocument();
  });

  it('renders Continue Shopping button when cart is empty', () => {
    render(<Cart />);
    expect(screen.getByRole('button', { name: 'Continue Shopping' })).toBeInTheDocument();
  });

  it('calls setShowCart(false) when close button is clicked', () => {
    render(<Cart />);
    const closeButton = screen.getByText('Your Cart').closest('button');
    fireEvent.click(closeButton);
    expect(mockSetShowCart).toHaveBeenCalledWith(false);
  });

  it('renders cart items when items exist', () => {
    mockContextValues.cartItems = mockCartItems;
    render(<Cart />);
    expect(screen.getByText('Headphones')).toBeInTheDocument();
    expect(screen.getByText('Speaker')).toBeInTheDocument();
  });

  it('displays item prices', () => {
    mockContextValues.cartItems = mockCartItems;
    render(<Cart />);
    const prices = screen.getAllByText('$250');
    expect(prices.length).toBe(2);
  });

  it('displays item quantities', () => {
    mockContextValues.cartItems = mockCartItems;
    render(<Cart />);
    const quantities = screen.getAllByText('1');
    expect(quantities.length).toBeGreaterThanOrEqual(2);
  });

  it('calls toggleCartItemQuanitity with inc on plus click', () => {
    mockContextValues.cartItems = [mockCartItems[0]];
    render(<Cart />);
    const plusButtons = screen.getAllByTestId('plus-icon');
    fireEvent.click(plusButtons[0].closest('span'));
    expect(mockToggleCartItemQuanitity).toHaveBeenCalledWith('1', 'inc');
  });

  it('calls toggleCartItemQuanitity with dec on minus click', () => {
    mockContextValues.cartItems = [mockCartItems[0]];
    render(<Cart />);
    const minusButtons = screen.getAllByTestId('minus-icon');
    fireEvent.click(minusButtons[0].closest('span'));
    expect(mockToggleCartItemQuanitity).toHaveBeenCalledWith('1', 'dec');
  });

  it('calls onRemove when delete button is clicked', () => {
    mockContextValues.cartItems = [mockCartItems[0]];
    render(<Cart />);
    const removeButton = screen.getByTestId('delete-icon').closest('button');
    fireEvent.click(removeButton);
    expect(mockOnRemove).toHaveBeenCalledWith(mockCartItems[0]);
  });

  it('displays the subtotal when items exist', () => {
    mockContextValues.cartItems = mockCartItems;
    render(<Cart />);
    expect(screen.getByText('Subtotal:')).toBeInTheDocument();
    expect(screen.getByText('$500')).toBeInTheDocument();
  });

  it('renders Pay with Stripe button when items exist', () => {
    mockContextValues.cartItems = mockCartItems;
    render(<Cart />);
    expect(screen.getByRole('button', { name: 'Pay with Stripe' })).toBeInTheDocument();
  });

  it('does not render subtotal when cart is empty', () => {
    render(<Cart />);
    expect(screen.queryByText('Subtotal:')).not.toBeInTheDocument();
  });

  it('calls setShowCart(false) on Continue Shopping click', () => {
    render(<Cart />);
    fireEvent.click(screen.getByRole('button', { name: 'Continue Shopping' }));
    expect(mockSetShowCart).toHaveBeenCalledWith(false);
  });

  it('has the cart-wrapper class', () => {
    const { container } = render(<Cart />);
    expect(container.firstChild).toHaveClass('cart-wrapper');
  });

  it('handleCheckout calls fetch and redirectToCheckout on success', async () => {
    mockContextValues.cartItems = mockCartItems;
    global.fetch = jest.fn().mockResolvedValueOnce({
      statusCode: 200,
      json: () => Promise.resolve({ id: 'cs_test_123' }),
    });

    render(<Cart />);
    const payButton = screen.getByRole('button', { name: 'Pay with Stripe' });
    fireEvent.click(payButton);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/stripe', expect.objectContaining({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      }));
    });

    await waitFor(() => {
      expect(mockRedirectToCheckout).toHaveBeenCalledWith({ sessionId: 'cs_test_123' });
    });
  });

  it('handleCheckout returns early on 500 status', async () => {
    mockContextValues.cartItems = mockCartItems;
    global.fetch = jest.fn().mockResolvedValueOnce({
      statusCode: 500,
      json: () => Promise.resolve({}),
    });

    render(<Cart />);
    const payButton = screen.getByRole('button', { name: 'Pay with Stripe' });
    fireEvent.click(payButton);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalled();
    });

    // Should not call redirectToCheckout since statusCode is 500
    expect(mockRedirectToCheckout).not.toHaveBeenCalled();
  });
});
