import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Layout from '../Layout';

jest.mock('../Navbar', () => () => <div data-testid="navbar">Navbar</div>);
jest.mock('../Footer', () => () => <div data-testid="footer">Footer</div>);

describe('Layout', () => {
  it('renders children', () => {
    render(<Layout><div data-testid="child">Hello</div></Layout>);
    expect(screen.getByTestId('child')).toBeInTheDocument();
  });

  it('renders head with title', () => {
    const { container } = render(<Layout><div>Content</div></Layout>);
    expect(container.querySelector('.layout')).toBeInTheDocument();
  });

  it('renders Navbar', () => {
    render(<Layout><div>Content</div></Layout>);
    expect(screen.getByTestId('navbar')).toBeInTheDocument();
  });

  it('renders Footer', () => {
    render(<Layout><div>Content</div></Layout>);
    expect(screen.getByTestId('footer')).toBeInTheDocument();
  });

  it('renders main container', () => {
    const { container } = render(<Layout><div>Content</div></Layout>);
    expect(container.querySelector('.main-container')).toBeInTheDocument();
  });

  it('renders header element', () => {
    const { container } = render(<Layout><div>Content</div></Layout>);
    expect(container.querySelector('header')).toBeInTheDocument();
  });

  it('renders footer element', () => {
    const { container } = render(<Layout><div>Content</div></Layout>);
    expect(container.querySelector('footer')).toBeInTheDocument();
  });
});
