import React from 'react';
import { render, screen, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import ProductDetails, { getStaticPaths, getStaticProps } from '../[slug]';

const mockIncQty = jest.fn();
const mockDecQty = jest.fn();
const mockOnAdd = jest.fn();
const mockSetShowCart = jest.fn();

jest.mock('../../../context/StateContext', () => ({
  useStateContext: () => ({
    qty: 1,
    incQty: mockIncQty,
    decQty: mockDecQty,
    onAdd: mockOnAdd,
    setShowCart: mockSetShowCart,
    showCart: false,
    cartItems: [],
    totalPrice: 0,
    totalQuantities: 0,
    setCartItems: jest.fn(),
    setTotalPrice: jest.fn(),
    setTotalQuantities: jest.fn(),
    toggleCartItemQuanitity: jest.fn(),
    onRemove: jest.fn(),
  }),
}));

jest.mock('../../../lib/client', () => ({
  client: { fetch: jest.fn() },
  urlFor: jest.fn(() => ({
    toString: () => 'https://mock-image.com/product.webp',
  })),
}));

jest.mock('../../../components', () => ({
  Product: ({ product }) => <div data-testid={`related-${product._id}`}>{product.name}</div>,
}));

jest.mock('react-icons/ai', () => ({
  AiOutlineMinus: () => <span data-testid="minus-icon">-</span>,
  AiOutlinePlus: () => <span data-testid="plus-icon">+</span>,
  AiFillStar: () => <span>★</span>,
  AiOutlineStar: () => <span>☆</span>,
}));

const { client } = require('../../../lib/client');

const mockProduct = {
  _id: 'p1',
  name: 'Test Speaker',
  details: 'Amazing sound quality',
  price: 499,
  image: [
    { asset: { _ref: 'image-1' } },
    { asset: { _ref: 'image-2' } },
  ],
  slug: { current: 'test-speaker' },
};

const mockProducts = [
  { _id: 'p2', name: 'Related Product', price: 199, slug: { current: 'related' }, image: [{ asset: { _ref: 'img' } }] },
];

describe('ProductDetails page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders product name', () => {
    render(<ProductDetails product={mockProduct} products={mockProducts} />);
    expect(screen.getByText('Test Speaker')).toBeInTheDocument();
  });

  it('renders product details', () => {
    render(<ProductDetails product={mockProduct} products={mockProducts} />);
    expect(screen.getByText('Amazing sound quality')).toBeInTheDocument();
  });

  it('renders product price', () => {
    render(<ProductDetails product={mockProduct} products={mockProducts} />);
    expect(screen.getByText('$499')).toBeInTheDocument();
  });

  it('renders product images', () => {
    render(<ProductDetails product={mockProduct} products={mockProducts} />);
    const images = screen.getAllByRole('img');
    expect(images.length).toBeGreaterThanOrEqual(1);
  });

  it('clicking minus calls decQty', () => {
    render(<ProductDetails product={mockProduct} products={mockProducts} />);
    const minus = screen.getByTestId('minus-icon');
    act(() => { minus.closest('span.minus').click(); });
    expect(mockDecQty).toHaveBeenCalled();
  });

  it('clicking plus calls incQty', () => {
    render(<ProductDetails product={mockProduct} products={mockProducts} />);
    const plus = screen.getByTestId('plus-icon');
    act(() => { plus.closest('span.plus').click(); });
    expect(mockIncQty).toHaveBeenCalled();
  });

  it('Add to Cart calls onAdd', () => {
    render(<ProductDetails product={mockProduct} products={mockProducts} />);
    const addButton = screen.getByText('Add to Cart');
    act(() => { addButton.click(); });
    expect(mockOnAdd).toHaveBeenCalledWith(mockProduct, 1);
  });

  it('Buy Now calls onAdd and setShowCart(true)', () => {
    render(<ProductDetails product={mockProduct} products={mockProducts} />);
    const buyButton = screen.getByText('Buy Now');
    act(() => { buyButton.click(); });
    expect(mockOnAdd).toHaveBeenCalledWith(mockProduct, 1);
    expect(mockSetShowCart).toHaveBeenCalledWith(true);
  });
});

describe('getStaticPaths', () => {
  it('returns paths from fetched products', async () => {
    client.fetch.mockResolvedValueOnce([
      { slug: { current: 'product-a' } },
      { slug: { current: 'product-b' } },
    ]);

    const result = await getStaticPaths();

    expect(result.paths).toEqual([
      { params: { slug: 'product-a' } },
      { params: { slug: 'product-b' } },
    ]);
    expect(result.fallback).toBe('blocking');
  });
});

describe('getStaticProps', () => {
  it('fetches product and products', async () => {
    client.fetch.mockResolvedValueOnce(mockProduct).mockResolvedValueOnce(mockProducts);

    const result = await getStaticProps({ params: { slug: 'test-speaker' } });

    expect(result).toEqual({
      props: { products: mockProducts, product: mockProduct },
    });
  });
});
