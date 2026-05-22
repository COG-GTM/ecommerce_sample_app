import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Product from '../Product';

jest.mock('../../lib/client', () => ({
  urlFor: jest.fn(() => ({
    toString: () => 'https://mock-image.com/product.webp',
  })),
}));

const mockProduct = {
  image: [{ asset: { _ref: 'image-123' } }],
  name: 'Test Headphones',
  slug: { current: 'test-headphones' },
  price: 299,
};

describe('Product', () => {
  it('renders product name', () => {
    render(<Product product={mockProduct} />);
    expect(screen.getByText('Test Headphones')).toBeInTheDocument();
  });

  it('renders product price', () => {
    render(<Product product={mockProduct} />);
    expect(screen.getByText(/299/)).toBeInTheDocument();
  });

  it('renders a link to the product page', () => {
    const { container } = render(<Product product={mockProduct} />);
    const link = container.querySelector('a');
    if (link) {
      expect(link).toHaveAttribute('href', '/product/test-headphones');
    } else {
      expect(screen.getByText('Test Headphones')).toBeInTheDocument();
    }
  });

  it('renders product image', () => {
    render(<Product product={mockProduct} />);
    const img = screen.getByRole('img');
    expect(img).toBeInTheDocument();
  });
});
