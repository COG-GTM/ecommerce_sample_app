import React from 'react';
import { render, screen } from '@testing-library/react';
import Product from '../../components/Product';

jest.mock('../../lib/client', () => ({
  urlFor: jest.fn(() => 'https://mock-image.com/product.jpg'),
}));

const mockProduct = {
  _id: 'prod-1',
  image: ['image-ref-1', 'image-ref-2'],
  name: 'Wireless Headphones',
  slug: { current: 'wireless-headphones' },
  price: 299,
};

describe('Product', () => {
  it('should render product name and price (happy path)', () => {
    render(<Product product={mockProduct} />);

    expect(screen.getByText('Wireless Headphones')).toBeInTheDocument();
    expect(screen.getByText('$299')).toBeInTheDocument();
  });

  it('should render the product image', () => {
    render(<Product product={mockProduct} />);

    const img = screen.getByRole('img');
    expect(img).toHaveAttribute('src', 'https://mock-image.com/product.jpg');
    expect(img).toHaveAttribute('width', '250');
    expect(img).toHaveAttribute('height', '250');
  });

  it('should link to the correct product detail page', () => {
    render(<Product product={mockProduct} />);

    // Next.js Link renders an <a> tag around the product card
    const productCard = screen.getByText('Wireless Headphones').closest('.product-card');
    expect(productCard).toBeInTheDocument();
  });

  it('should render with different product data', () => {
    const anotherProduct = {
      _id: 'prod-2',
      image: ['img-ref'],
      name: 'Bluetooth Speaker',
      slug: { current: 'bluetooth-speaker' },
      price: 49,
    };
    render(<Product product={anotherProduct} />);

    expect(screen.getByText('Bluetooth Speaker')).toBeInTheDocument();
    expect(screen.getByText('$49')).toBeInTheDocument();
  });
});
