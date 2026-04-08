import React from 'react';
import { render, screen } from '@testing-library/react';
import Product from '../../components/Product';

jest.mock('../../lib/client', () => ({
  urlFor: jest.fn((source) => `https://cdn.sanity.io/mock/${source}`),
}));

const mockProduct = {
  _id: 'prod-1',
  name: 'Test Headphones',
  slug: { current: 'test-headphones' },
  price: 249,
  image: [{ asset: { _ref: 'image-abc-webp' } }],
};

describe('Product', () => {
  // ===== HAPPY PATH TESTS =====

  it('should render product name', () => {
    render(<Product product={mockProduct} />);
    expect(screen.getByText('Test Headphones')).toBeInTheDocument();
  });

  it('should render product price', () => {
    render(<Product product={mockProduct} />);
    expect(screen.getByText('$249')).toBeInTheDocument();
  });

  it('should link to the correct product slug', () => {
    render(<Product product={mockProduct} />);
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/product/test-headphones');
  });

  it('should render the product image', () => {
    render(<Product product={mockProduct} />);
    const img = screen.getByRole('img');
    expect(img).toHaveClass('product-image');
    expect(img).toHaveAttribute('width', '250');
    expect(img).toHaveAttribute('height', '250');
  });

  // ===== SAD PATH TESTS =====

  it('should handle product with zero price', () => {
    const freeProduct = { ...mockProduct, price: 0 };
    render(<Product product={freeProduct} />);
    expect(screen.getByText('$0')).toBeInTheDocument();
  });

  it('should handle product with missing image gracefully', () => {
    const noImageProduct = { ...mockProduct, image: null };
    // urlFor(null && null[0]) -> urlFor(null)
    const { container } = render(<Product product={noImageProduct} />);
    expect(container).toBeTruthy();
  });
});
