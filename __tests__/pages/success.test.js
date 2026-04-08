import React from 'react';
import { render, screen } from '@testing-library/react';
import Success from '../../pages/success';
import { useStateContext } from '../../context/StateContext';
import { runFireworks } from '../../lib/utils';

jest.mock('../../context/StateContext', () => ({
  useStateContext: jest.fn(),
}));

jest.mock('../../lib/utils', () => ({
  runFireworks: jest.fn(),
}));

jest.mock('react-icons/bs', () => ({
  BsBagCheckFill: () => <span data-testid="icon-bag-check">check</span>,
}));

const mockSetCartItems = jest.fn();
const mockSetTotalPrice = jest.fn();
const mockSetTotalQuantities = jest.fn();

beforeEach(() => {
  jest.clearAllMocks();
  Storage.prototype.clear = jest.fn();
  useStateContext.mockReturnValue({
    setCartItems: mockSetCartItems,
    setTotalPrice: mockSetTotalPrice,
    setTotalQuantities: mockSetTotalQuantities,
  });
});

describe('Success Page', () => {
  // ===== HAPPY PATH TESTS =====

  it('should render thank you message', () => {
    render(<Success />);
    expect(screen.getByText('Thank you for your order!')).toBeInTheDocument();
  });

  it('should render email message', () => {
    render(<Success />);
    expect(screen.getByText('Check your email inbox for the receipt.')).toBeInTheDocument();
  });

  it('should render contact email link', () => {
    render(<Success />);
    const emailLink = screen.getByRole('link', { name: /order@example.com/i });
    expect(emailLink).toHaveAttribute('href', 'mailto:order@example.com');
  });

  it('should render Continue Shopping button', () => {
    render(<Success />);
    expect(screen.getByRole('button', { name: /Continue Shopping/i })).toBeInTheDocument();
  });

  it('should render the success check icon', () => {
    render(<Success />);
    expect(screen.getByTestId('icon-bag-check')).toBeInTheDocument();
  });

  it('should clear cart state on mount', () => {
    render(<Success />);
    expect(mockSetCartItems).toHaveBeenCalledWith([]);
    expect(mockSetTotalPrice).toHaveBeenCalledWith(0);
    expect(mockSetTotalQuantities).toHaveBeenCalledWith(0);
  });

  it('should clear localStorage on mount', () => {
    render(<Success />);
    expect(localStorage.clear).toHaveBeenCalled();
  });

  it('should run fireworks animation on mount', () => {
    render(<Success />);
    expect(runFireworks).toHaveBeenCalled();
  });

  // ===== SAD PATH TESTS =====

  it('should only call cleanup once even on re-render', () => {
    const { rerender } = render(<Success />);
    rerender(<Success />);
    // useEffect with [] should only run once
    expect(mockSetCartItems).toHaveBeenCalledTimes(1);
    expect(runFireworks).toHaveBeenCalledTimes(1);
  });
});
