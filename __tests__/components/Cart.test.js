import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Cart from '../../components/Cart';
import { useStateContext } from '../../context/StateContext';

jest.mock('../../context/StateContext', () => ({
  useStateContext: jest.fn(),
}));

jest.mock('../../lib/client', () => ({
  urlFor: jest.fn((source) => `https://cdn.sanity.io/mock/${source}`),
}));

jest.mock('../../lib/getStripe', () =>
  jest.fn(() =>
    Promise.resolve({
      redirectToCheckout: jest.fn(),
    })
  )
);

jest.mock('react-icons/ai', () => ({
  AiOutlineMinus: () => <span data-testid="icon-minus">-</span>,
  AiOutlinePlus: () => <span data-testid="icon-plus">+</span>,
  AiOutlineLeft: () => <span data-testid="icon-left">&lt;</span>,
  AiOutlineShopping: () => <span data-testid="icon-shopping">cart</span>,
}));

jest.mock('react-icons/ti', () => ({
  TiDeleteOutline: () => <span data-testid="icon-delete">x</span>,
}));

const mockSetShowCart = jest.fn();
const mockToggle = jest.fn();
const mockOnRemove = jest.fn();

const mockCartItem = {
  _id: 'prod-1',
  name: 'Test Headphones',
  price: 100,
  quantity: 2,
  image: [{ asset: { _ref: 'image-abc-webp' } }],
};

const setupMock = (overrides = {}) => {
  useStateContext.mockReturnValue({
    totalPrice: 200,
    totalQuantities: 2,
    cartItems: [mockCartItem],
    setShowCart: mockSetShowCart,
    toggleCartItemQuanitity: mockToggle,
    onRemove: mockOnRemove,
    ...overrides,
  });
};

describe('Cart', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ===== HAPPY PATH TESTS =====

  it('should render cart heading with total quantities', () => {
    setupMock();
    render(<Cart />);
    expect(screen.getByText('Your Cart')).toBeInTheDocument();
    expect(screen.getByText('(2 items)')).toBeInTheDocument();
  });

  it('should render cart items with name and price', () => {
    setupMock();
    render(<Cart />);
    expect(screen.getByText('Test Headphones')).toBeInTheDocument();
    expect(screen.getByText('$100')).toBeInTheDocument();
  });

  it('should render item quantity', () => {
    setupMock();
    render(<Cart />);
    expect(screen.getByText('2')).toBeInTheDocument();
  });

  it('should render subtotal', () => {
    setupMock();
    render(<Cart />);
    expect(screen.getByText('Subtotal:')).toBeInTheDocument();
    expect(screen.getByText('$200')).toBeInTheDocument();
  });

  it('should render Pay with Stripe button', () => {
    setupMock();
    render(<Cart />);
    expect(screen.getByRole('button', { name: /Pay with Stripe/i })).toBeInTheDocument();
  });

  it('should call setShowCart(false) when back button is clicked', async () => {
    const user = userEvent.setup();
    setupMock();
    render(<Cart />);

    const backButton = screen.getByText('Your Cart').closest('button');
    await user.click(backButton);
    expect(mockSetShowCart).toHaveBeenCalledWith(false);
  });

  it('should call toggleCartItemQuanitity with inc when plus is clicked', async () => {
    const user = userEvent.setup();
    setupMock();
    render(<Cart />);

    const plusButton = screen.getByTestId('icon-plus').closest('span');
    await user.click(plusButton);
    expect(mockToggle).toHaveBeenCalledWith('prod-1', 'inc');
  });

  it('should call toggleCartItemQuanitity with dec when minus is clicked', async () => {
    const user = userEvent.setup();
    setupMock();
    render(<Cart />);

    const minusButton = screen.getByTestId('icon-minus').closest('span');
    await user.click(minusButton);
    expect(mockToggle).toHaveBeenCalledWith('prod-1', 'dec');
  });

  it('should call onRemove when delete button is clicked', async () => {
    const user = userEvent.setup();
    setupMock();
    render(<Cart />);

    const removeButton = screen.getByRole('button', { name: /x/i });
    await user.click(removeButton);
    expect(mockOnRemove).toHaveBeenCalledWith(mockCartItem);
  });

  // ===== SAD PATH TESTS =====

  it('should show empty cart message when no items', () => {
    setupMock({ cartItems: [], totalQuantities: 0, totalPrice: 0 });
    render(<Cart />);
    expect(screen.getByText('Your shopping bag is empty')).toBeInTheDocument();
  });

  it('should show Continue Shopping button when cart is empty', () => {
    setupMock({ cartItems: [], totalQuantities: 0, totalPrice: 0 });
    render(<Cart />);
    expect(screen.getByRole('button', { name: /Continue Shopping/i })).toBeInTheDocument();
  });

  it('should not render subtotal when cart is empty', () => {
    setupMock({ cartItems: [], totalQuantities: 0, totalPrice: 0 });
    render(<Cart />);
    expect(screen.queryByText('Subtotal:')).not.toBeInTheDocument();
  });

  it('should not render Pay with Stripe button when cart is empty', () => {
    setupMock({ cartItems: [], totalQuantities: 0, totalPrice: 0 });
    render(<Cart />);
    expect(screen.queryByRole('button', { name: /Pay with Stripe/i })).not.toBeInTheDocument();
  });
});
