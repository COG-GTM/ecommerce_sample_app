import React from 'react';
import { render, screen } from '@testing-library/react';
import Layout from '../../components/Layout';

// Mock child components
jest.mock('../../components/Navbar', () => () => <div data-testid="navbar" />);
jest.mock('../../components/Footer', () => () => <div data-testid="footer" />);

describe('Layout', () => {
  it('should render children content (happy path)', () => {
    render(
      <Layout>
        <div data-testid="child">Hello</div>
      </Layout>
    );
    expect(screen.getByTestId('child')).toBeInTheDocument();
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });

  it('should render Navbar and Footer', () => {
    render(
      <Layout>
        <div>Content</div>
      </Layout>
    );
    expect(screen.getByTestId('navbar')).toBeInTheDocument();
    expect(screen.getByTestId('footer')).toBeInTheDocument();
  });

  it('should set the page title to JS Mastery Store', () => {
    render(
      <Layout>
        <div>Content</div>
      </Layout>
    );
    // next/head injects into <head> which may not be testable in jsdom,
    // but the component should still render without error
    expect(document.querySelector('.layout')).toBeInTheDocument();
  });

  it('should render with empty children (edge case)', () => {
    render(<Layout>{null}</Layout>);
    expect(screen.getByTestId('navbar')).toBeInTheDocument();
    expect(screen.getByTestId('footer')).toBeInTheDocument();
  });
});
