import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Layout from '../../components/Layout';

jest.mock('next/head', () => {
  return ({ children }) => <>{children}</>;
});

jest.mock('../../components/Navbar', () => {
  return () => <nav data-testid="navbar">Navbar</nav>;
});

jest.mock('../../components/Footer', () => {
  return () => <div data-testid="footer">Footer</div>;
});

describe('Layout', () => {
  it('renders the children', () => {
    render(<Layout><div data-testid="child">Child Content</div></Layout>);
    expect(screen.getByTestId('child')).toBeInTheDocument();
  });

  it('renders the Navbar', () => {
    render(<Layout><div>Content</div></Layout>);
    expect(screen.getByTestId('navbar')).toBeInTheDocument();
  });

  it('renders the Footer', () => {
    render(<Layout><div>Content</div></Layout>);
    expect(screen.getByTestId('footer')).toBeInTheDocument();
  });

  it('has the layout class', () => {
    const { container } = render(<Layout><div>Content</div></Layout>);
    expect(container.firstChild).toHaveClass('layout');
  });

  it('wraps Navbar in a header element', () => {
    render(<Layout><div>Content</div></Layout>);
    const header = screen.getByTestId('navbar').closest('header');
    expect(header).toBeInTheDocument();
  });

  it('wraps Footer in a footer element', () => {
    render(<Layout><div>Content</div></Layout>);
    const footer = screen.getByTestId('footer').closest('footer');
    expect(footer).toBeInTheDocument();
  });

  it('renders children in a main element', () => {
    render(<Layout><div data-testid="child">Content</div></Layout>);
    const main = screen.getByTestId('child').closest('main');
    expect(main).toHaveClass('main-container');
  });

  it('sets the page title', () => {
    render(<Layout><div>Content</div></Layout>);
    expect(screen.getByText('JS Mastery Store')).toBeInTheDocument();
  });
});
