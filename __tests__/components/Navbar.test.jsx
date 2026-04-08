import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Navbar from '../../components/Navbar';

const mockSetShowCart = jest.fn();
const mockValues = {
  showCart: false,
  setShowCart: mockSetShowCart,
  totalQuantities: 3,
};

jest.mock('../../context/StateContext', () => ({
  useStateContext: () => mockValues,
}));

jest.mock('../../components/Cart', () => () => <div data-testid="cart-component" />);

jest.mock('react-icons/ai', () => ({
  AiOutlineShopping: () => <span data-testid="shopping-icon" />,
}));

describe('Navbar', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockValues.showCart = false;
  });

  it('should render the logo linking to home (happy path)', () => {
    render(<Navbar />);

    const logo = screen.getByText('JSM Headphones');
    expect(logo).toBeInTheDocument();
    expect(logo.closest('a')).toHaveAttribute('href', '/');
  });

  it('should display the total quantity badge', () => {
    render(<Navbar />);
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('should show cart icon button', () => {
    render(<Navbar />);
    expect(screen.getByTestId('shopping-icon')).toBeInTheDocument();
  });

  it('should call setShowCart(true) when cart icon is clicked', async () => {
    render(<Navbar />);
    const user = userEvent.setup();

    const cartButton = screen.getByRole('button');
    await user.click(cartButton);

    expect(mockSetShowCart).toHaveBeenCalledWith(true);
  });

  it('should not render Cart component when showCart is false', () => {
    render(<Navbar />);
    expect(screen.queryByTestId('cart-component')).not.toBeInTheDocument();
  });

  it('should render Cart component when showCart is true', () => {
    mockValues.showCart = true;
    render(<Navbar />);
    expect(screen.getByTestId('cart-component')).toBeInTheDocument();
  });

  it('should display 0 when cart is empty', () => {
    mockValues.totalQuantities = 0;
    render(<Navbar />);
    expect(screen.getByText('0')).toBeInTheDocument();
  });
});
