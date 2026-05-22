import React from 'react';
import { render, screen, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import Navbar from '../Navbar';

const mockSetShowCart = jest.fn();
const mockContextValues = {
  showCart: false,
  setShowCart: mockSetShowCart,
  totalQuantities: 5,
  cartItems: [],
  totalPrice: 0,
  qty: 1,
  incQty: jest.fn(),
  decQty: jest.fn(),
  onAdd: jest.fn(),
  toggleCartItemQuanitity: jest.fn(),
  onRemove: jest.fn(),
  setCartItems: jest.fn(),
  setTotalPrice: jest.fn(),
  setTotalQuantities: jest.fn(),
};

jest.mock('../../context/StateContext', () => ({
  useStateContext: () => mockContextValues,
}));

jest.mock('../Cart', () => () => <div data-testid="cart-component">Cart</div>);

jest.mock('react-icons/ai', () => ({
  AiOutlineShopping: () => <span data-testid="shopping-icon">ShopIcon</span>,
}));

describe('Navbar', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockContextValues.showCart = false;
  });

  it('renders logo link', () => {
    render(<Navbar />);
    expect(screen.getByText('JSM Headphones')).toBeInTheDocument();
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/');
  });

  it('renders cart icon with totalQuantities', () => {
    render(<Navbar />);
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('clicking cart icon calls setShowCart(true)', () => {
    render(<Navbar />);
    const cartButton = screen.getByRole('button');
    act(() => { cartButton.click(); });
    expect(mockSetShowCart).toHaveBeenCalledWith(true);
  });

  it('renders Cart when showCart is true', () => {
    mockContextValues.showCart = true;
    render(<Navbar />);
    expect(screen.getByTestId('cart-component')).toBeInTheDocument();
  });

  it('does not render Cart when showCart is false', () => {
    render(<Navbar />);
    expect(screen.queryByTestId('cart-component')).not.toBeInTheDocument();
  });
});
