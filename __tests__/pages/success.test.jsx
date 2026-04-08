import React from 'react';
import { render, screen } from '@testing-library/react';
import Success from '../../pages/success';

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

jest.mock('../../lib/utils', () => ({
  runFireworks: jest.fn(),
}));

jest.mock('react-icons/bs', () => ({
  BsBagCheckFill: () => <span data-testid="check-icon" />,
}));

const { runFireworks } = require('../../lib/utils');

describe('Success Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Mock localStorage
    Object.defineProperty(window, 'localStorage', {
      value: { clear: jest.fn() },
      writable: true,
    });
  });

  it('should render thank you message (happy path)', () => {
    render(<Success />);

    expect(screen.getByText('Thank you for your order!')).toBeInTheDocument();
    expect(screen.getByText('Check your email inbox for the receipt.')).toBeInTheDocument();
  });

  it('should render the support email link', () => {
    render(<Success />);

    const emailLink = screen.getByText('order@example.com');
    expect(emailLink).toBeInTheDocument();
    expect(emailLink).toHaveAttribute('href', 'mailto:order@example.com');
  });

  it('should render Continue Shopping button', () => {
    render(<Success />);

    const button = screen.getByText('Continue Shopping');
    expect(button).toBeInTheDocument();
    expect(button.tagName).toBe('BUTTON');
  });

  it('should clear cart state on mount', () => {
    render(<Success />);

    expect(mockSetCartItems).toHaveBeenCalledWith([]);
    expect(mockSetTotalPrice).toHaveBeenCalledWith(0);
    expect(mockSetTotalQuantities).toHaveBeenCalledWith(0);
  });

  it('should clear localStorage on mount', () => {
    render(<Success />);
    expect(window.localStorage.clear).toHaveBeenCalled();
  });

  it('should run fireworks animation on mount', () => {
    render(<Success />);
    expect(runFireworks).toHaveBeenCalled();
  });

  it('should render the check icon', () => {
    render(<Success />);
    expect(screen.getByTestId('check-icon')).toBeInTheDocument();
  });
});
