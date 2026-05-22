import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import MyApp from '../_app';

jest.mock('../../context/StateContext', () => ({
  StateContext: ({ children }) => <div data-testid="state-context">{children}</div>,
  useStateContext: () => ({
    showCart: false,
    setShowCart: jest.fn(),
    cartItems: [],
    totalPrice: 0,
    totalQuantities: 0,
    qty: 1,
    incQty: jest.fn(),
    decQty: jest.fn(),
    onAdd: jest.fn(),
    toggleCartItemQuanitity: jest.fn(),
    onRemove: jest.fn(),
    setCartItems: jest.fn(),
    setTotalPrice: jest.fn(),
    setTotalQuantities: jest.fn(),
  }),
}));

jest.mock('../../components', () => ({
  Layout: ({ children }) => <div data-testid="layout">{children}</div>,
}));

jest.mock('react-hot-toast', () => ({
  Toaster: () => <div data-testid="toaster">Toaster</div>,
}));

const TestComponent = () => <div data-testid="page">Test Page</div>;

describe('MyApp', () => {
  it('renders the page component', () => {
    render(<MyApp Component={TestComponent} pageProps={{}} />);
    expect(screen.getByTestId('page')).toBeInTheDocument();
  });

  it('wraps content in StateContext', () => {
    render(<MyApp Component={TestComponent} pageProps={{}} />);
    expect(screen.getByTestId('state-context')).toBeInTheDocument();
  });

  it('wraps content in Layout', () => {
    render(<MyApp Component={TestComponent} pageProps={{}} />);
    expect(screen.getByTestId('layout')).toBeInTheDocument();
  });

  it('renders Toaster', () => {
    render(<MyApp Component={TestComponent} pageProps={{}} />);
    expect(screen.getByTestId('toaster')).toBeInTheDocument();
  });
});
