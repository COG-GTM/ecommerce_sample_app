import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Success from '../success';

const mockSetCartItems = jest.fn();
const mockSetTotalPrice = jest.fn();
const mockSetTotalQuantities = jest.fn();

jest.mock('../../context/StateContext', () => ({
  useStateContext: () => ({
    setCartItems: mockSetCartItems,
    setTotalPrice: mockSetTotalPrice,
    setTotalQuantities: mockSetTotalQuantities,
  }),
}));

const mockRunFireworks = jest.fn();
jest.mock('../../lib/utils', () => ({
  runFireworks: (...args) => mockRunFireworks(...args),
}));

jest.mock('react-icons/bs', () => ({
  BsBagCheckFill: () => <span data-testid="check-icon">Check</span>,
}));

describe('Success page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    Storage.prototype.clear = jest.fn();
    render(<Success />);
  });

  it('renders thank you message', () => {
    expect(screen.getByText('Thank you for your order!')).toBeInTheDocument();
  });

  it('renders email link', () => {
    const emailLink = screen.getByText('order@example.com');
    expect(emailLink).toBeInTheDocument();
    expect(emailLink).toHaveAttribute('href', 'mailto:order@example.com');
  });

  it('calls setCartItems([]) on mount', () => {
    expect(mockSetCartItems).toHaveBeenCalledWith([]);
  });

  it('calls setTotalPrice(0) on mount', () => {
    expect(mockSetTotalPrice).toHaveBeenCalledWith(0);
  });

  it('calls setTotalQuantities(0) on mount', () => {
    expect(mockSetTotalQuantities).toHaveBeenCalledWith(0);
  });

  it('calls runFireworks on mount', () => {
    expect(mockRunFireworks).toHaveBeenCalled();
  });
});
