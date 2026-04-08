import React from 'react';
import { render, screen } from '@testing-library/react';
import Home, { getServerSideProps } from '../../pages/index';
import { client } from '../../lib/client';

jest.mock('../../lib/client', () => ({
  client: { fetch: jest.fn() },
  urlFor: jest.fn((source) => `https://cdn.sanity.io/mock/${source}`),
}));

jest.mock('../../components', () => ({
  HeroBanner: ({ heroBanner }) => (
    <div data-testid="hero-banner">{heroBanner?.smallText || 'banner'}</div>
  ),
  FooterBanner: ({ footerBanner }) => (
    <div data-testid="footer-banner">{footerBanner?.smallText || 'footer'}</div>
  ),
  Product: ({ product }) => (
    <div data-testid="product-card">{product.name}</div>
  ),
}));

const mockProducts = [
  { _id: 'prod-1', name: 'Headphones' },
  { _id: 'prod-2', name: 'Speakers' },
];

const mockBannerData = [
  { smallText: 'SALE', midText: 'Summer', largeText1: 'FINE' },
];

describe('Home Page', () => {
  // ===== HAPPY PATH TESTS =====

  it('should render the HeroBanner component', () => {
    render(<Home products={mockProducts} bannerData={mockBannerData} />);
    expect(screen.getByTestId('hero-banner')).toBeInTheDocument();
  });

  it('should render the FooterBanner component', () => {
    render(<Home products={mockProducts} bannerData={mockBannerData} />);
    expect(screen.getByTestId('footer-banner')).toBeInTheDocument();
  });

  it('should render all products', () => {
    render(<Home products={mockProducts} bannerData={mockBannerData} />);
    const productCards = screen.getAllByTestId('product-card');
    expect(productCards).toHaveLength(2);
    expect(screen.getByText('Headphones')).toBeInTheDocument();
    expect(screen.getByText('Speakers')).toBeInTheDocument();
  });

  it('should render the "Best Seller Products" heading', () => {
    render(<Home products={mockProducts} bannerData={mockBannerData} />);
    expect(screen.getByText('Best Seller Products')).toBeInTheDocument();
  });

  describe('getServerSideProps', () => {
    it('should fetch products and banner data from Sanity', async () => {
      client.fetch.mockResolvedValueOnce(mockProducts);
      client.fetch.mockResolvedValueOnce(mockBannerData);

      const result = await getServerSideProps();

      expect(client.fetch).toHaveBeenCalledWith('*[_type == "product"]');
      expect(client.fetch).toHaveBeenCalledWith('*[_type == "banner"]');
      expect(result).toEqual({
        props: { products: mockProducts, bannerData: mockBannerData },
      });
    });
  });

  // ===== SAD PATH TESTS =====

  it('should handle empty products array', () => {
    render(<Home products={[]} bannerData={mockBannerData} />);
    expect(screen.queryByTestId('product-card')).not.toBeInTheDocument();
  });

  it('should handle empty bannerData array', () => {
    render(<Home products={mockProducts} bannerData={[]} />);
    // bannerData.length is falsy for [], so HeroBanner gets 0 as prop
    expect(screen.getByTestId('hero-banner')).toBeInTheDocument();
  });

  it('should handle null products gracefully', () => {
    render(<Home products={null} bannerData={mockBannerData} />);
    expect(screen.queryByTestId('product-card')).not.toBeInTheDocument();
  });
});
