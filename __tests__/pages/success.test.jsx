import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Success from '../../pages/success';

jest.mock('next/link', () => {
  return ({ children, href }) => <a href={href}>{children}</a>;
});

jest.mock('react-icons/bs', () => ({
  BsBagCheckFill: () => <span data-testid="check-icon" />,
}));

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

describe('Success Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    Storage.prototype.clear = jest.fn();
  });

  it('renders the thank you message', () => {
    render(<Success />);
    expect(screen.getByText('Thank you for your order!')).toBeInTheDocument();
  });

  it('renders the email message', () => {
    render(<Success />);
    expect(screen.getByText('Check your email inbox for the receipt.')).toBeInTheDocument();
  });

  it('renders the contact email link', () => {
    render(<Success />);
    const emailLink = screen.getByText('order@example.com');
    expect(emailLink).toHaveAttribute('href', 'mailto:order@example.com');
  });

  it('renders the Continue Shopping button', () => {
    render(<Success />);
    expect(screen.getByRole('button', { name: 'Continue Shopping' })).toBeInTheDocument();
  });

  it('links Continue Shopping to homepage', () => {
    render(<Success />);
    const link = screen.getByRole('button', { name: 'Continue Shopping' }).closest('a');
    expect(link).toHaveAttribute('href', '/');
  });

  it('renders the check icon', () => {
    render(<Success />);
    expect(screen.getByTestId('check-icon')).toBeInTheDocument();
  });

  it('clears localStorage on mount', () => {
    render(<Success />);
    expect(localStorage.clear).toHaveBeenCalled();
  });

  it('resets cart items on mount', () => {
    render(<Success />);
    expect(mockSetCartItems).toHaveBeenCalledWith([]);
  });

  it('resets total price on mount', () => {
    render(<Success />);
    expect(mockSetTotalPrice).toHaveBeenCalledWith(0);
  });

  it('resets total quantities on mount', () => {
    render(<Success />);
    expect(mockSetTotalQuantities).toHaveBeenCalledWith(0);
  });

  it('calls runFireworks on mount', () => {
    const { runFireworks } = require('../../lib/utils');
    render(<Success />);
    expect(runFireworks).toHaveBeenCalled();
  });

  it('has the success-wrapper class', () => {
    const { container } = render(<Success />);
    expect(container.firstChild).toHaveClass('success-wrapper');
  });
});
