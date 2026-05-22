import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Product from '../../components/Product';

jest.mock('next/link', () => {
  return ({ children, href }) => <a href={href}>{children}</a>;
});

jest.mock('../../lib/client', () => ({
  urlFor: jest.fn((source) => `https://cdn.sanity.io/mock-image/${source}`),
}));

const mockProduct = {
  image: ['image-ref-1', 'image-ref-2'],
  name: 'Headphones Pro',
  slug: { current: 'headphones-pro' },
  price: 249,
};

describe('Product', () => {
  it('renders the product name', () => {
    render(<Product product={mockProduct} />);
    expect(screen.getByText('Headphones Pro')).toBeInTheDocument();
  });

  it('renders the product price', () => {
    render(<Product product={mockProduct} />);
    expect(screen.getByText('$249')).toBeInTheDocument();
  });

  it('links to the correct product detail page', () => {
    render(<Product product={mockProduct} />);
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/product/headphones-pro');
  });

  it('renders the product image', () => {
    render(<Product product={mockProduct} />);
    const img = screen.getByRole('img');
    expect(img).toHaveClass('product-image');
  });

  it('has the product-card class', () => {
    render(<Product product={mockProduct} />);
    expect(screen.getByText('Headphones Pro').closest('.product-card')).toBeInTheDocument();
  });

  it('renders the product name with product-name class', () => {
    render(<Product product={mockProduct} />);
    const nameEl = screen.getByText('Headphones Pro');
    expect(nameEl).toHaveClass('product-name');
  });

  it('renders the product price with product-price class', () => {
    render(<Product product={mockProduct} />);
    const priceEl = screen.getByText('$249');
    expect(priceEl).toHaveClass('product-price');
  });
});
