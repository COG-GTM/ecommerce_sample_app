import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ProductDetails, { getStaticPaths, getStaticProps } from '../../../pages/product/[slug]';
import { client } from '../../../lib/client';
import { useStateContext } from '../../../context/StateContext';

jest.mock('../../../lib/client', () => ({
  client: { fetch: jest.fn() },
  urlFor: jest.fn((source) => `https://cdn.sanity.io/mock/${source}`),
}));

jest.mock('../../../context/StateContext', () => ({
  useStateContext: jest.fn(),
}));

jest.mock('../../../components', () => ({
  Product: ({ product }) => (
    <div data-testid="related-product">{product.name}</div>
  ),
}));

jest.mock('react-icons/ai', () => ({
  AiOutlineMinus: () => <span data-testid="icon-minus">-</span>,
  AiOutlinePlus: () => <span data-testid="icon-plus">+</span>,
  AiFillStar: () => <span data-testid="icon-star-filled">*</span>,
  AiOutlineStar: () => <span data-testid="icon-star-outline">o</span>,
}));

const mockOnAdd = jest.fn();
const mockSetShowCart = jest.fn();
const mockIncQty = jest.fn();
const mockDecQty = jest.fn();

const setupMock = (overrides = {}) => {
  useStateContext.mockReturnValue({
    decQty: mockDecQty,
    incQty: mockIncQty,
    qty: 1,
    onAdd: mockOnAdd,
    setShowCart: mockSetShowCart,
    ...overrides,
  });
};

const mockProduct = {
  _id: 'prod-1',
  name: 'Wireless Headphones',
  details: 'Premium noise-cancelling headphones',
  price: 299,
  image: [
    { asset: { _ref: 'image-main-webp' } },
    { asset: { _ref: 'image-side-webp' } },
  ],
  slug: { current: 'wireless-headphones' },
};

const mockRelatedProducts = [
  { _id: 'prod-2', name: 'Bluetooth Speaker', slug: { current: 'bluetooth-speaker' } },
  { _id: 'prod-3', name: 'Earbuds Pro', slug: { current: 'earbuds-pro' } },
];

describe('ProductDetails Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    setupMock();
  });

  // ===== HAPPY PATH TESTS =====

  it('should render the product name', () => {
    render(<ProductDetails product={mockProduct} products={mockRelatedProducts} />);
    expect(screen.getByText('Wireless Headphones')).toBeInTheDocument();
  });

  it('should render the product details', () => {
    render(<ProductDetails product={mockProduct} products={mockRelatedProducts} />);
    expect(screen.getByText('Premium noise-cancelling headphones')).toBeInTheDocument();
  });

  it('should render the product price', () => {
    render(<ProductDetails product={mockProduct} products={mockRelatedProducts} />);
    expect(screen.getByText('$299')).toBeInTheDocument();
  });

  it('should render star ratings', () => {
    render(<ProductDetails product={mockProduct} products={mockRelatedProducts} />);
    const filledStars = screen.getAllByTestId('icon-star-filled');
    const outlineStars = screen.getAllByTestId('icon-star-outline');
    expect(filledStars).toHaveLength(4);
    expect(outlineStars).toHaveLength(1);
  });

  it('should render the main product image', () => {
    render(<ProductDetails product={mockProduct} products={mockRelatedProducts} />);
    const images = screen.getAllByRole('img');
    expect(images.length).toBeGreaterThan(0);
  });

  it('should render thumbnail images', () => {
    render(<ProductDetails product={mockProduct} products={mockRelatedProducts} />);
    const images = screen.getAllByRole('img');
    // Main image + 2 thumbnails
    expect(images.length).toBeGreaterThanOrEqual(3);
  });

  it('should render Add to Cart button', () => {
    render(<ProductDetails product={mockProduct} products={mockRelatedProducts} />);
    expect(screen.getByRole('button', { name: /Add to Cart/i })).toBeInTheDocument();
  });

  it('should render Buy Now button', () => {
    render(<ProductDetails product={mockProduct} products={mockRelatedProducts} />);
    expect(screen.getByRole('button', { name: /Buy Now/i })).toBeInTheDocument();
  });

  it('should display the current quantity', () => {
    setupMock({ qty: 3 });
    render(<ProductDetails product={mockProduct} products={mockRelatedProducts} />);
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('should call incQty when plus is clicked', async () => {
    const user = userEvent.setup();
    render(<ProductDetails product={mockProduct} products={mockRelatedProducts} />);

    const plusButton = screen.getByTestId('icon-plus').closest('span');
    await user.click(plusButton);
    expect(mockIncQty).toHaveBeenCalled();
  });

  it('should call decQty when minus is clicked', async () => {
    const user = userEvent.setup();
    render(<ProductDetails product={mockProduct} products={mockRelatedProducts} />);

    const minusButton = screen.getByTestId('icon-minus').closest('span');
    await user.click(minusButton);
    expect(mockDecQty).toHaveBeenCalled();
  });

  it('should call onAdd when Add to Cart is clicked', async () => {
    const user = userEvent.setup();
    render(<ProductDetails product={mockProduct} products={mockRelatedProducts} />);

    await user.click(screen.getByRole('button', { name: /Add to Cart/i }));
    expect(mockOnAdd).toHaveBeenCalledWith(mockProduct, 1);
  });

  it('should call onAdd and setShowCart when Buy Now is clicked', async () => {
    const user = userEvent.setup();
    render(<ProductDetails product={mockProduct} products={mockRelatedProducts} />);

    await user.click(screen.getByRole('button', { name: /Buy Now/i }));
    expect(mockOnAdd).toHaveBeenCalledWith(mockProduct, 1);
    expect(mockSetShowCart).toHaveBeenCalledWith(true);
  });

  it('should render "You may also like" section', () => {
    render(<ProductDetails product={mockProduct} products={mockRelatedProducts} />);
    expect(screen.getByText('You may also like')).toBeInTheDocument();
  });

  it('should render related products', () => {
    render(<ProductDetails product={mockProduct} products={mockRelatedProducts} />);
    const relatedProducts = screen.getAllByTestId('related-product');
    expect(relatedProducts).toHaveLength(2);
    expect(screen.getByText('Bluetooth Speaker')).toBeInTheDocument();
    expect(screen.getByText('Earbuds Pro')).toBeInTheDocument();
  });

  // ===== SAD PATH TESTS =====

  it('should handle product with single image', () => {
    const singleImageProduct = {
      ...mockProduct,
      image: [{ asset: { _ref: 'image-only-webp' } }],
    };
    const { container } = render(
      <ProductDetails product={singleImageProduct} products={mockRelatedProducts} />
    );
    expect(container).toBeTruthy();
  });

  it('should handle empty related products', () => {
    render(<ProductDetails product={mockProduct} products={[]} />);
    expect(screen.getByText('You may also like')).toBeInTheDocument();
    expect(screen.queryByTestId('related-product')).not.toBeInTheDocument();
  });

  it('should handle product with zero price', () => {
    const freeProduct = { ...mockProduct, price: 0 };
    render(<ProductDetails product={freeProduct} products={mockRelatedProducts} />);
    expect(screen.getByText('$0')).toBeInTheDocument();
  });
});

describe('getStaticPaths', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch product slugs and return paths', async () => {
    const mockProducts = [
      { slug: { current: 'headphones' } },
      { slug: { current: 'speakers' } },
    ];
    client.fetch.mockResolvedValue(mockProducts);

    const result = await getStaticPaths();

    expect(client.fetch).toHaveBeenCalled();
    expect(result.paths).toHaveLength(2);
    expect(result.paths[0].params.slug).toBe('headphones');
    expect(result.paths[1].params.slug).toBe('speakers');
    expect(result.fallback).toBe('blocking');
  });

  it('should return empty paths when no products exist', async () => {
    client.fetch.mockResolvedValue([]);

    const result = await getStaticPaths();
    expect(result.paths).toHaveLength(0);
  });
});

describe('getStaticProps', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch product and related products by slug', async () => {
    client.fetch.mockResolvedValueOnce(mockProduct);
    client.fetch.mockResolvedValueOnce(mockRelatedProducts);

    const result = await getStaticProps({ params: { slug: 'wireless-headphones' } });

    expect(client.fetch).toHaveBeenCalledTimes(2);
    expect(result.props.product).toEqual(mockProduct);
    expect(result.props.products).toEqual(mockRelatedProducts);
  });

  it('should pass the slug parameter into the query', async () => {
    client.fetch.mockResolvedValueOnce(mockProduct);
    client.fetch.mockResolvedValueOnce([]);

    await getStaticProps({ params: { slug: 'test-slug' } });

    // Find the call that contains the slug query (not the products query)
    const slugCall = client.fetch.mock.calls.find(call => call[0].includes('test-slug'));
    expect(slugCall).toBeTruthy();
    expect(slugCall[0]).toContain('test-slug');
  });
});
