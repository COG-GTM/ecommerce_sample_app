import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Navbar from '../../components/Navbar';

jest.mock('next/link', () => {
  return ({ children, href }) => <a href={href}>{children}</a>;
});

jest.mock('react-icons/ai', () => ({
  AiOutlineShopping: () => <span data-testid="shopping-icon" />,
}));

const mockSetShowCart = jest.fn();
const mockContextValues = {
  showCart: false,
  setShowCart: mockSetShowCart,
  totalQuantities: 3,
};

jest.mock('../../context/StateContext', () => ({
  useStateContext: () => mockContextValues,
}));

jest.mock('../../components/Cart', () => {
  return () => <div data-testid="cart">Cart Component</div>;
});

describe('Navbar', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockContextValues.showCart = false;
  });

  it('renders the logo link', () => {
    render(<Navbar />);
    expect(screen.getByText('JSM Headphones')).toBeInTheDocument();
  });

  it('links the logo to the homepage', () => {
    render(<Navbar />);
    const link = screen.getByText('JSM Headphones').closest('a');
    expect(link).toHaveAttribute('href', '/');
  });

  it('renders the cart icon button', () => {
    render(<Navbar />);
    expect(screen.getByTestId('shopping-icon')).toBeInTheDocument();
  });

  it('displays the total quantities', () => {
    render(<Navbar />);
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('calls setShowCart(true) when the cart icon button is clicked', () => {
    render(<Navbar />);
    const cartButton = screen.getByTestId('shopping-icon').closest('button');
    fireEvent.click(cartButton);
    expect(mockSetShowCart).toHaveBeenCalledWith(true);
  });

  it('does not render Cart component when showCart is false', () => {
    render(<Navbar />);
    expect(screen.queryByTestId('cart')).not.toBeInTheDocument();
  });

  it('renders Cart component when showCart is true', () => {
    mockContextValues.showCart = true;
    render(<Navbar />);
    expect(screen.getByTestId('cart')).toBeInTheDocument();
  });

  it('has the navbar-container class', () => {
    const { container } = render(<Navbar />);
    expect(container.firstChild).toHaveClass('navbar-container');
  });

  it('displays cart quantity with cart-item-qty class', () => {
    render(<Navbar />);
    const qtySpan = screen.getByText('3');
    expect(qtySpan).toHaveClass('cart-item-qty');
  });
});
