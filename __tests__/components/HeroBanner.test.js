import React from 'react';
import { render, screen } from '@testing-library/react';
import HeroBanner from '../../components/HeroBanner';

jest.mock('../../lib/client', () => ({
  urlFor: jest.fn((source) => `https://cdn.sanity.io/mock/${source}`),
}));

const mockBannerData = {
  smallText: 'BEATS SOLO AIR',
  midText: 'Summer Sale',
  largeText1: 'FINE',
  buttonText: 'Shop Now',
  product: 'headphones',
  desc: 'Best headphones on the market',
  image: 'banner-image-ref',
};

describe('HeroBanner', () => {
  // ===== HAPPY PATH TESTS =====

  it('should render small text', () => {
    render(<HeroBanner heroBanner={mockBannerData} />);
    expect(screen.getByText('BEATS SOLO AIR')).toBeInTheDocument();
  });

  it('should render mid text', () => {
    render(<HeroBanner heroBanner={mockBannerData} />);
    expect(screen.getByText('Summer Sale')).toBeInTheDocument();
  });

  it('should render large text', () => {
    render(<HeroBanner heroBanner={mockBannerData} />);
    expect(screen.getByText('FINE')).toBeInTheDocument();
  });

  it('should render the button with correct text', () => {
    render(<HeroBanner heroBanner={mockBannerData} />);
    expect(screen.getByRole('button', { name: 'Shop Now' })).toBeInTheDocument();
  });

  it('should render the banner image with alt text', () => {
    render(<HeroBanner heroBanner={mockBannerData} />);
    const img = screen.getByAltText('headphones');
    expect(img).toBeInTheDocument();
  });

  it('should render the description text', () => {
    render(<HeroBanner heroBanner={mockBannerData} />);
    expect(screen.getByText('Best headphones on the market')).toBeInTheDocument();
  });

  it('should link the button to the product page', () => {
    render(<HeroBanner heroBanner={mockBannerData} />);
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/product/headphones');
  });

  // ===== SAD PATH TESTS =====

  it('should handle missing optional fields gracefully', () => {
    const minimalBanner = {
      smallText: '',
      midText: '',
      largeText1: '',
      buttonText: '',
      product: '',
      desc: '',
      image: null,
    };
    const { container } = render(<HeroBanner heroBanner={minimalBanner} />);
    expect(container.querySelector('.hero-banner-container')).toBeInTheDocument();
  });
});
