import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Navbar from '../../components/Navbar';
import { useStateContext } from '../../context/StateContext';

jest.mock('../../context/StateContext', () => ({
  useStateContext: jest.fn(),
}));

jest.mock('../../components/Cart', () => () => <div data-testid="cart">Cart</div>);

jest.mock('react-icons/ai', () => ({
  AiOutlineShopping: () => <span data-testid="icon-shopping">cart</span>,
}));

const mockSetShowCart = jest.fn();

const setupMock = (overrides = {}) => {
  useStateContext.mockReturnValue({
    showCart: false,
    setShowCart: mockSetShowCart,
    totalQuantities: 0,
    ...overrides,
  });
};

describe('Navbar', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ===== HAPPY PATH TESTS =====

  it('should render the logo with link to home', () => {
    setupMock();
    render(<Navbar />);
    const link = screen.getByRole('link', { name: /JSM Headphones/i });
    expect(link).toHaveAttribute('href', '/');
  });

  it('should display total quantities in cart badge', () => {
    setupMock({ totalQuantities: 5 });
    render(<Navbar />);
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('should call setShowCart(true) when cart icon is clicked', async () => {
    const user = userEvent.setup();
    setupMock();
    render(<Navbar />);

    const cartButton = screen.getByRole('button');
    await user.click(cartButton);
    expect(mockSetShowCart).toHaveBeenCalledWith(true);
  });

  it('should render Cart component when showCart is true', () => {
    setupMock({ showCart: true });
    render(<Navbar />);
    expect(screen.getByTestId('cart')).toBeInTheDocument();
  });

  // ===== SAD PATH TESTS =====

  it('should not render Cart when showCart is false', () => {
    setupMock({ showCart: false });
    render(<Navbar />);
    expect(screen.queryByTestId('cart')).not.toBeInTheDocument();
  });

  it('should display 0 when cart is empty', () => {
    setupMock({ totalQuantities: 0 });
    render(<Navbar />);
    expect(screen.getByText('0')).toBeInTheDocument();
  });
});
