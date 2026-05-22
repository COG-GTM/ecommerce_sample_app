import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Home, { getServerSideProps } from '../index';

jest.mock('../../components', () => ({
  Product: ({ product }) => <div data-testid={`product-${product._id}`}>{product.name}</div>,
  HeroBanner: ({ heroBanner }) => <div data-testid="hero-banner">{heroBanner?.smallText}</div>,
  FooterBanner: ({ footerBanner }) => <div data-testid="footer-banner">{footerBanner?.discount}</div>,
}));

jest.mock('../../lib/client', () => ({
  client: {
    fetch: jest.fn(),
  },
}));

const { client } = require('../../lib/client');

const mockProducts = [
  { _id: '1', name: 'Product A', price: 100, slug: { current: 'product-a' } },
  { _id: '2', name: 'Product B', price: 200, slug: { current: 'product-b' } },
];

const mockBannerData = [
  { smallText: 'BEATS', discount: '20% OFF', largeText1: 'FINE' },
];

describe('Home page', () => {
  it('renders Best Seller Products heading', () => {
    render(<Home products={mockProducts} bannerData={mockBannerData} />);
    expect(screen.getByText('Best Seller Products')).toBeInTheDocument();
  });

  it('renders Product components for each product', () => {
    render(<Home products={mockProducts} bannerData={mockBannerData} />);
    expect(screen.getByTestId('product-1')).toBeInTheDocument();
    expect(screen.getByTestId('product-2')).toBeInTheDocument();
  });

  it('renders HeroBanner', () => {
    render(<Home products={mockProducts} bannerData={mockBannerData} />);
    expect(screen.getByTestId('hero-banner')).toBeInTheDocument();
  });

  it('renders FooterBanner', () => {
    render(<Home products={mockProducts} bannerData={mockBannerData} />);
    expect(screen.getByTestId('footer-banner')).toBeInTheDocument();
  });
});

describe('getServerSideProps', () => {
  it('fetches products and bannerData', async () => {
    client.fetch.mockResolvedValueOnce(mockProducts).mockResolvedValueOnce(mockBannerData);

    const result = await getServerSideProps();

    expect(result).toEqual({
      props: { products: mockProducts, bannerData: mockBannerData },
    });
    expect(client.fetch).toHaveBeenCalledTimes(2);
  });
});
