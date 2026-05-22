import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Home, { getServerSideProps } from '../../pages/index';

jest.mock('next/link', () => {
  return ({ children, href }) => <a href={href}>{children}</a>;
});

jest.mock('../../lib/client', () => ({
  client: {
    fetch: jest.fn(),
  },
  urlFor: jest.fn((source) => `https://cdn.sanity.io/mock-image/${source}`),
}));

jest.mock('../../components', () => ({
  Product: ({ product }) => <div data-testid={`product-${product._id}`}>{product.name}</div>,
  FooterBanner: ({ footerBanner }) => <div data-testid="footer-banner">{footerBanner.largeText1}</div>,
  HeroBanner: ({ heroBanner }) => <div data-testid="hero-banner">{heroBanner.smallText}</div>,
}));

const mockProducts = [
  { _id: '1', name: 'Headphones', slug: { current: 'headphones' }, price: 100, image: ['img1'] },
  { _id: '2', name: 'Speaker', slug: { current: 'speaker' }, price: 200, image: ['img2'] },
];

const mockBannerData = [
  {
    smallText: 'BEATS SOLO',
    midText: 'Summer Sale',
    largeText1: 'FINE',
    buttonText: 'Shop Now',
    product: 'headphones',
    desc: 'Best headphones',
    image: 'banner-img',
    discount: '20% OFF',
    largeText2: 'SMILE',
    saleTime: '15 Nov',
  },
];

describe('Home Page', () => {
  it('renders the products heading', () => {
    render(<Home products={mockProducts} bannerData={mockBannerData} />);
    expect(screen.getByText('Best Seller Products')).toBeInTheDocument();
  });

  it('renders the subheading', () => {
    render(<Home products={mockProducts} bannerData={mockBannerData} />);
    expect(screen.getByText('speaker There are many variations passages')).toBeInTheDocument();
  });

  it('renders each product', () => {
    render(<Home products={mockProducts} bannerData={mockBannerData} />);
    expect(screen.getByTestId('product-1')).toBeInTheDocument();
    expect(screen.getByTestId('product-2')).toBeInTheDocument();
  });

  it('renders the HeroBanner', () => {
    render(<Home products={mockProducts} bannerData={mockBannerData} />);
    expect(screen.getByTestId('hero-banner')).toBeInTheDocument();
  });

  it('renders the FooterBanner', () => {
    render(<Home products={mockProducts} bannerData={mockBannerData} />);
    expect(screen.getByTestId('footer-banner')).toBeInTheDocument();
  });

  it('handles empty products array', () => {
    render(<Home products={[]} bannerData={mockBannerData} />);
    expect(screen.getByText('Best Seller Products')).toBeInTheDocument();
  });

  it('handles undefined products gracefully', () => {
    render(<Home products={undefined} bannerData={mockBannerData} />);
    expect(screen.getByText('Best Seller Products')).toBeInTheDocument();
  });
});

describe('getServerSideProps', () => {
  it('fetches products and banner data', async () => {
    const { client } = require('../../lib/client');
    client.fetch
      .mockResolvedValueOnce(mockProducts)
      .mockResolvedValueOnce(mockBannerData);

    const result = await getServerSideProps();
    expect(result).toEqual({
      props: { products: mockProducts, bannerData: mockBannerData },
    });
  });

  it('calls client.fetch with product query', async () => {
    const { client } = require('../../lib/client');
    client.fetch
      .mockResolvedValueOnce([])
      .mockResolvedValueOnce([]);

    await getServerSideProps();
    expect(client.fetch).toHaveBeenCalledWith('*[_type == "product"]');
  });

  it('calls client.fetch with banner query', async () => {
    const { client } = require('../../lib/client');
    client.fetch
      .mockResolvedValueOnce([])
      .mockResolvedValueOnce([]);

    await getServerSideProps();
    expect(client.fetch).toHaveBeenCalledWith('*[_type == "banner"]');
  });
});
