import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ProductDetails, { getStaticPaths, getStaticProps } from '../../../pages/product/[slug]';

jest.mock('next/link', () => {
  return ({ children, href }) => <a href={href}>{children}</a>;
});

jest.mock('react-icons/ai', () => ({
  AiOutlineMinus: () => <span data-testid="minus-icon" />,
  AiOutlinePlus: () => <span data-testid="plus-icon" />,
  AiFillStar: () => <span data-testid="filled-star" />,
  AiOutlineStar: () => <span data-testid="outline-star" />,
}));

jest.mock('../../../lib/client', () => ({
  client: {
    fetch: jest.fn(),
  },
  urlFor: jest.fn((source) => `https://cdn.sanity.io/mock-image/${source}`),
}));

jest.mock('../../../components', () => ({
  Product: ({ product }) => <div data-testid={`product-${product._id}`}>{product.name}</div>,
}));

const mockDecQty = jest.fn();
const mockIncQty = jest.fn();
const mockOnAdd = jest.fn();
const mockSetShowCart = jest.fn();

jest.mock('../../../context/StateContext', () => ({
  useStateContext: () => ({
    decQty: mockDecQty,
    incQty: mockIncQty,
    qty: 1,
    onAdd: mockOnAdd,
    setShowCart: mockSetShowCart,
  }),
}));

const mockProduct = {
  _id: 'prod1',
  image: ['img1', 'img2', 'img3'],
  name: 'Test Headphones',
  details: 'Amazing headphones with great sound',
  price: 299,
  slug: { current: 'test-headphones' },
};

const mockProducts = [
  { _id: 'p1', name: 'Related 1', slug: { current: 'related-1' }, price: 100, image: ['img1'] },
  { _id: 'p2', name: 'Related 2', slug: { current: 'related-2' }, price: 200, image: ['img2'] },
];

describe('ProductDetails', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the product name', () => {
    render(<ProductDetails product={mockProduct} products={mockProducts} />);
    expect(screen.getByText('Test Headphones')).toBeInTheDocument();
  });

  it('renders the product details', () => {
    render(<ProductDetails product={mockProduct} products={mockProducts} />);
    expect(screen.getByText('Amazing headphones with great sound')).toBeInTheDocument();
  });

  it('renders the product price', () => {
    render(<ProductDetails product={mockProduct} products={mockProducts} />);
    expect(screen.getByText('$299')).toBeInTheDocument();
  });

  it('renders star ratings', () => {
    render(<ProductDetails product={mockProduct} products={mockProducts} />);
    const filledStars = screen.getAllByTestId('filled-star');
    const outlineStars = screen.getAllByTestId('outline-star');
    expect(filledStars).toHaveLength(4);
    expect(outlineStars).toHaveLength(1);
  });

  it('renders review count', () => {
    render(<ProductDetails product={mockProduct} products={mockProducts} />);
    expect(screen.getByText('(20)')).toBeInTheDocument();
  });

  it('renders the quantity section', () => {
    render(<ProductDetails product={mockProduct} products={mockProducts} />);
    expect(screen.getByText('Quantity:')).toBeInTheDocument();
  });

  it('renders Add to Cart button', () => {
    render(<ProductDetails product={mockProduct} products={mockProducts} />);
    expect(screen.getByRole('button', { name: 'Add to Cart' })).toBeInTheDocument();
  });

  it('renders Buy Now button', () => {
    render(<ProductDetails product={mockProduct} products={mockProducts} />);
    expect(screen.getByRole('button', { name: 'Buy Now' })).toBeInTheDocument();
  });

  it('calls incQty when plus is clicked', () => {
    render(<ProductDetails product={mockProduct} products={mockProducts} />);
    const plusIcon = screen.getAllByTestId('plus-icon')[0];
    fireEvent.click(plusIcon.closest('span'));
    expect(mockIncQty).toHaveBeenCalled();
  });

  it('calls decQty when minus is clicked', () => {
    render(<ProductDetails product={mockProduct} products={mockProducts} />);
    const minusIcon = screen.getAllByTestId('minus-icon')[0];
    fireEvent.click(minusIcon.closest('span'));
    expect(mockDecQty).toHaveBeenCalled();
  });

  it('calls onAdd when Add to Cart is clicked', () => {
    render(<ProductDetails product={mockProduct} products={mockProducts} />);
    fireEvent.click(screen.getByRole('button', { name: 'Add to Cart' }));
    expect(mockOnAdd).toHaveBeenCalledWith(mockProduct, 1);
  });

  it('calls onAdd and setShowCart when Buy Now is clicked', () => {
    render(<ProductDetails product={mockProduct} products={mockProducts} />);
    fireEvent.click(screen.getByRole('button', { name: 'Buy Now' }));
    expect(mockOnAdd).toHaveBeenCalledWith(mockProduct, 1);
    expect(mockSetShowCart).toHaveBeenCalledWith(true);
  });

  it('renders related products section', () => {
    render(<ProductDetails product={mockProduct} products={mockProducts} />);
    expect(screen.getByText('You may also like')).toBeInTheDocument();
  });

  it('renders related product items', () => {
    render(<ProductDetails product={mockProduct} products={mockProducts} />);
    expect(screen.getByTestId('product-p1')).toBeInTheDocument();
    expect(screen.getByTestId('product-p2')).toBeInTheDocument();
  });

  it('renders thumbnail images', () => {
    render(<ProductDetails product={mockProduct} products={mockProducts} />);
    const images = screen.getAllByRole('img');
    expect(images.length).toBeGreaterThanOrEqual(3);
  });

  it('renders the Details label', () => {
    render(<ProductDetails product={mockProduct} products={mockProducts} />);
    expect(screen.getByText('Details:')).toBeInTheDocument();
  });
});

describe('getStaticPaths', () => {
  it('returns paths with slugs', async () => {
    const { client } = require('../../../lib/client');
    client.fetch.mockResolvedValueOnce([
      { slug: { current: 'headphones' } },
      { slug: { current: 'speaker' } },
    ]);

    const result = await getStaticPaths();
    expect(result.paths).toEqual([
      { params: { slug: 'headphones' } },
      { params: { slug: 'speaker' } },
    ]);
    expect(result.fallback).toBe('blocking');
  });

  it('returns empty paths when no products', async () => {
    const { client } = require('../../../lib/client');
    client.fetch.mockResolvedValueOnce([]);

    const result = await getStaticPaths();
    expect(result.paths).toEqual([]);
  });
});

describe('getStaticProps', () => {
  it('fetches product and products', async () => {
    const { client } = require('../../../lib/client');
    client.fetch
      .mockResolvedValueOnce(mockProduct)
      .mockResolvedValueOnce(mockProducts);

    const result = await getStaticProps({ params: { slug: 'test-headphones' } });
    expect(result).toEqual({
      props: { products: mockProducts, product: mockProduct },
    });
  });

  it('calls fetch with correct product query', async () => {
    const { client } = require('../../../lib/client');
    client.fetch
      .mockResolvedValueOnce(mockProduct)
      .mockResolvedValueOnce(mockProducts);

    await getStaticProps({ params: { slug: 'test-headphones' } });
    expect(client.fetch).toHaveBeenCalledWith(
      expect.stringContaining('test-headphones')
    );
  });
});
