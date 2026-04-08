import React from 'react';
import { render, screen } from '@testing-library/react';
import Layout from '../../components/Layout';

jest.mock('../../components/Navbar', () => () => <div data-testid="navbar">Navbar</div>);
jest.mock('../../components/Footer', () => () => <div data-testid="footer">Footer</div>);

describe('Layout', () => {
  // ===== HAPPY PATH TESTS =====

  it('should render children content', () => {
    render(<Layout><p>Test Content</p></Layout>);
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('should render the Navbar', () => {
    render(<Layout><p>Test</p></Layout>);
    expect(screen.getByTestId('navbar')).toBeInTheDocument();
  });

  it('should render the Footer', () => {
    render(<Layout><p>Test</p></Layout>);
    expect(screen.getByTestId('footer')).toBeInTheDocument();
  });

  it('should have layout class on root div', () => {
    const { container } = render(<Layout><p>Test</p></Layout>);
    expect(container.querySelector('.layout')).toBeInTheDocument();
  });

  it('should have main-container class on main element', () => {
    const { container } = render(<Layout><p>Test</p></Layout>);
    expect(container.querySelector('main.main-container')).toBeInTheDocument();
  });

  // ===== SAD PATH TESTS =====

  it('should render without children', () => {
    const { container } = render(<Layout />);
    expect(container.querySelector('.layout')).toBeInTheDocument();
  });
});
