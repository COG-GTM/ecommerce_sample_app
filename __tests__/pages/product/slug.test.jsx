import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ProductDetails, { getStaticPaths, getStaticProps } from '../../../pages/product/[slug]';

const mockOnAdd = jest.fn();
const mockSetShowCart = jest.fn();

jest.mock('../../../context/StateContext', () => ({
  useStateContext: () => ({
    decQty: jest.fn(),
    incQty: jest.fn(),
    qty: 1,
    onAdd: mockOnAdd,
    setShowCart: mockSetShowCart,
  }),
}));

jest.mock('../../../lib/client', () => ({
  client: { fetch: jest.fn() },
  urlFor: jest.fn(() => 'https://mock-image.com/product.jpg'),
}));

jest.mock('../../../components', () => ({
  Product: ({ product }) => <div data-testid={`related-${product._id}`}>{product.name}</div>,
}));

jest.mock('react-icons/ai', () => ({
  AiOutlineMinus: () => <span data-testid="minus-icon" />,
  AiOutlinePlus: () => <span data-testid="plus-icon" />,
  AiFillStar: () => <span data-testid="filled-star" />,
  AiOutlineStar: () => <span data-testid="outline-star" />,
}));

const { client } = require('../../../lib/client');

const mockProduct = {
  _id: 'prod-1',
  image: ['img-ref-1', 'img-ref-2'],
  name: 'Wireless Headphones',
  details: 'Premium sound quality with noise cancellation',
  price: 299,
  slug: { current: 'wireless-headphones' },
};

const mockProducts = [
  { _id: 'prod-2', name: 'Speaker', slug: { current: 'speaker' }, price: 99, image: ['img'] },
  { _id: 'prod-3', name: 'Earbuds', slug: { current: 'earbuds' }, price: 49, image: ['img'] },
];

describe('ProductDetails Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Component rendering', () => {
    it('should render product name and price (happy path)', () => {
      render(<ProductDetails product={mockProduct} products={mockProducts} />);

      expect(screen.getByText('Wireless Headphones')).toBeInTheDocument();
      expect(screen.getByText('$299')).toBeInTheDocument();
    });

    it('should render product details', () => {
      render(<ProductDetails product={mockProduct} products={mockProducts} />);
      expect(screen.getByText('Premium sound quality with noise cancellation')).toBeInTheDocument();
    });

    it('should render star ratings (4 filled, 1 outline)', () => {
      render(<ProductDetails product={mockProduct} products={mockProducts} />);
      expect(screen.getAllByTestId('filled-star')).toHaveLength(4);
      expect(screen.getAllByTestId('outline-star')).toHaveLength(1);
    });

    it('should render quantity selector with default qty of 1', () => {
      render(<ProductDetails product={mockProduct} products={mockProducts} />);
      expect(screen.getByText('Quantity:')).toBeInTheDocument();
      expect(screen.getByText('1')).toBeInTheDocument();
    });

    it('should render Add to Cart and Buy Now buttons', () => {
      render(<ProductDetails product={mockProduct} products={mockProducts} />);
      expect(screen.getByText('Add to Cart')).toBeInTheDocument();
      expect(screen.getByText('Buy Now')).toBeInTheDocument();
    });

    it('should render related products section', () => {
      render(<ProductDetails product={mockProduct} products={mockProducts} />);
      expect(screen.getByText('You may also like')).toBeInTheDocument();
      expect(screen.getByTestId('related-prod-2')).toBeInTheDocument();
      expect(screen.getByTestId('related-prod-3')).toBeInTheDocument();
    });

    it('should render product images with thumbnails', () => {
      render(<ProductDetails product={mockProduct} products={mockProducts} />);
      const images = screen.getAllByRole('img');
      // 1 main image + 2 thumbnails
      expect(images.length).toBeGreaterThanOrEqual(3);
    });

    it('should call onAdd when Add to Cart is clicked', async () => {
      render(<ProductDetails product={mockProduct} products={mockProducts} />);
      const user = userEvent.setup();

      await user.click(screen.getByText('Add to Cart'));
      expect(mockOnAdd).toHaveBeenCalledWith(mockProduct, 1);
    });

    it('should call onAdd and setShowCart when Buy Now is clicked', async () => {
      render(<ProductDetails product={mockProduct} products={mockProducts} />);
      const user = userEvent.setup();

      await user.click(screen.getByText('Buy Now'));
      expect(mockOnAdd).toHaveBeenCalledWith(mockProduct, 1);
      expect(mockSetShowCart).toHaveBeenCalledWith(true);
    });
  });

  describe('getStaticPaths', () => {
    it('should return paths for all products (happy path)', async () => {
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

    it('should return empty paths when no products exist (edge case)', async () => {
      client.fetch.mockResolvedValueOnce([]);

      const result = await getStaticPaths();
      expect(result.paths).toEqual([]);
      expect(result.fallback).toBe('blocking');
    });

    it('should propagate fetch errors (sad path)', async () => {
      client.fetch.mockRejectedValueOnce(new Error('CMS down'));
      await expect(getStaticPaths()).rejects.toThrow('CMS down');
    });
  });

  describe('getStaticProps', () => {
    it('should fetch product by slug and all products (happy path)', async () => {
      // Suppress console.log from the component
      jest.spyOn(console, 'log').mockImplementation();

      client.fetch
        .mockResolvedValueOnce(mockProduct)
        .mockResolvedValueOnce(mockProducts);

      const result = await getStaticProps({ params: { slug: 'wireless-headphones' } });

      expect(client.fetch).toHaveBeenCalledTimes(2);
      expect(result).toEqual({
        props: { products: mockProducts, product: mockProduct },
      });

      console.log.mockRestore();
    });

    it('should propagate fetch errors (sad path)', async () => {
      client.fetch.mockRejectedValueOnce(new Error('Not found'));
      await expect(
        getStaticProps({ params: { slug: 'nonexistent' } })
      ).rejects.toThrow('Not found');
    });
  });
});
