import React from 'react';
import { render, screen } from '@testing-library/react';
import Home, { getServerSideProps } from '../../pages/index';

jest.mock('../../lib/client', () => ({
  client: {
    fetch: jest.fn(),
  },
  urlFor: jest.fn(() => 'https://mock-image.com/img.jpg'),
}));

jest.mock('../../components', () => ({
  Product: ({ product }) => <div data-testid={`product-${product._id}`}>{product.name}</div>,
  HeroBanner: ({ heroBanner }) => (
    <div data-testid="hero-banner">{heroBanner?.smallText || 'no banner'}</div>
  ),
  FooterBanner: ({ footerBanner }) => (
    <div data-testid="footer-banner">{footerBanner?.midText || 'no footer'}</div>
  ),
}));

const { client } = require('../../lib/client');

const mockProducts = [
  { _id: 'p1', name: 'Headphones', slug: { current: 'headphones' }, price: 100, image: ['img1'] },
  { _id: 'p2', name: 'Speaker', slug: { current: 'speaker' }, price: 200, image: ['img2'] },
];

const mockBannerData = [
  { smallText: 'Sale', midText: 'Summer', largeText1: 'BIG', product: 'headphones', buttonText: 'Buy' },
];

describe('Home Page', () => {
  describe('Component rendering', () => {
    it('should render products and banners (happy path)', () => {
      render(<Home products={mockProducts} bannerData={mockBannerData} />);

      expect(screen.getByTestId('hero-banner')).toHaveTextContent('Sale');
      expect(screen.getByTestId('footer-banner')).toHaveTextContent('Summer');
      expect(screen.getByText('Headphones')).toBeInTheDocument();
      expect(screen.getByText('Speaker')).toBeInTheDocument();
    });

    it('should render heading text', () => {
      render(<Home products={mockProducts} bannerData={mockBannerData} />);

      expect(screen.getByText('Best Seller Products')).toBeInTheDocument();
      expect(screen.getByText('speaker There are many variations passages')).toBeInTheDocument();
    });

    it('should handle empty products array (edge case)', () => {
      render(<Home products={[]} bannerData={mockBannerData} />);

      expect(screen.getByTestId('hero-banner')).toBeInTheDocument();
      expect(screen.queryByTestId('product-p1')).not.toBeInTheDocument();
    });

    it('should handle empty bannerData array (edge case)', () => {
      render(<Home products={mockProducts} bannerData={[]} />);

      expect(screen.getByTestId('hero-banner')).toHaveTextContent('no banner');
    });

    it('should handle null/undefined products gracefully', () => {
      render(<Home products={null} bannerData={mockBannerData} />);
      // Should not crash due to optional chaining in component
      expect(screen.getByTestId('hero-banner')).toBeInTheDocument();
    });
  });

  describe('getServerSideProps', () => {
    beforeEach(() => {
      client.fetch.mockClear();
    });

    it('should fetch products and bannerData (happy path)', async () => {
      client.fetch
        .mockResolvedValueOnce(mockProducts)
        .mockResolvedValueOnce(mockBannerData);

      const result = await getServerSideProps();

      expect(client.fetch).toHaveBeenCalledTimes(2);
      expect(client.fetch).toHaveBeenCalledWith('*[_type == "product"]');
      expect(client.fetch).toHaveBeenCalledWith('*[_type == "banner"]');
      expect(result).toEqual({
        props: { products: mockProducts, bannerData: mockBannerData },
      });
    });

    it('should propagate errors from client.fetch (sad path)', async () => {
      client.fetch.mockRejectedValueOnce(new Error('Network error'));

      await expect(getServerSideProps()).rejects.toThrow('Network error');
    });
  });
});
