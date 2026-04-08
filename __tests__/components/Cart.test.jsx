import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Cart from '../../components/Cart';

const mockSetShowCart = jest.fn();
const mockToggleCartItemQuanitity = jest.fn();
const mockOnRemove = jest.fn();

const mockContextValues = {
  totalPrice: 300,
  totalQuantities: 3,
  cartItems: [
    {
      _id: 'item1',
      name: 'Headphones',
      price: 100,
      quantity: 2,
      image: ['image-ref-1'],
    },
    {
      _id: 'item2',
      name: 'Speaker',
      price: 100,
      quantity: 1,
      image: ['image-ref-2'],
    },
  ],
  setShowCart: mockSetShowCart,
  toggleCartItemQuanitity: mockToggleCartItemQuanitity,
  onRemove: mockOnRemove,
};

jest.mock('../../context/StateContext', () => ({
  useStateContext: () => mockContextValues,
}));

jest.mock('../../lib/client', () => ({
  urlFor: jest.fn(() => 'https://mock-image.com/product.jpg'),
}));

jest.mock('../../lib/getStripe', () =>
  jest.fn(() => Promise.resolve({ redirectToCheckout: jest.fn() }))
);

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
  default: { loading: jest.fn(), success: jest.fn() },
}));

describe('Cart', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset to items in cart state
    mockContextValues.cartItems = [
      {
        _id: 'item1',
        name: 'Headphones',
        price: 100,
        quantity: 2,
        image: ['image-ref-1'],
      },
      {
        _id: 'item2',
        name: 'Speaker',
        price: 100,
        quantity: 1,
        image: ['image-ref-2'],
      },
    ];
    mockContextValues.totalPrice = 300;
    mockContextValues.totalQuantities = 3;
  });

  it('should render cart heading with item count (happy path)', () => {
    render(<Cart />);
    expect(screen.getByText('Your Cart')).toBeInTheDocument();
    expect(screen.getByText('(3 items)')).toBeInTheDocument();
  });

  it('should render all cart items', () => {
    render(<Cart />);
    expect(screen.getByText('Headphones')).toBeInTheDocument();
    expect(screen.getByText('Speaker')).toBeInTheDocument();
  });

  it('should display item prices', () => {
    render(<Cart />);
    expect(screen.getAllByText('$100')).toHaveLength(2);
  });

  it('should display the subtotal', () => {
    render(<Cart />);
    expect(screen.getByText('Subtotal:')).toBeInTheDocument();
    expect(screen.getByText('$300')).toBeInTheDocument();
  });

  it('should call setShowCart(false) when back button is clicked', async () => {
    render(<Cart />);
    const user = userEvent.setup();

    const heading = screen.getByText('Your Cart');
    const backButton = heading.closest('button');
    await user.click(backButton);

    expect(mockSetShowCart).toHaveBeenCalledWith(false);
  });

  it('should show empty cart message when no items (sad path)', () => {
    mockContextValues.cartItems = [];
    mockContextValues.totalQuantities = 0;

    render(<Cart />);
    expect(screen.getByText('Your shopping bag is empty')).toBeInTheDocument();
    expect(screen.getByText('Continue Shopping')).toBeInTheDocument();
  });

  it('should render Pay with Stripe button when cart has items', () => {
    render(<Cart />);
    expect(screen.getByText('Pay with Stripe')).toBeInTheDocument();
  });

  it('should not render Pay with Stripe button when cart is empty', () => {
    mockContextValues.cartItems = [];
    render(<Cart />);
    expect(screen.queryByText('Pay with Stripe')).not.toBeInTheDocument();
  });
});
