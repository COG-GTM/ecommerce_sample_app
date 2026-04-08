import React from 'react';
import { render, screen } from '@testing-library/react';
import HeroBanner from '../../components/HeroBanner';

jest.mock('../../lib/client', () => ({
  urlFor: jest.fn(() => 'https://mock-image.com/banner.jpg'),
}));

const mockBanner = {
  smallText: 'BEATS SOLO AIR',
  midText: 'Summer Sale',
  largeText1: 'FINE',
  image: 'banner-image-ref',
  product: 'headphones',
  buttonText: 'Shop Now',
  desc: 'Best headphones on the market',
};

describe('HeroBanner', () => {
  it('should render all banner text content (happy path)', () => {
    render(<HeroBanner heroBanner={mockBanner} />);

    expect(screen.getByText('BEATS SOLO AIR')).toBeInTheDocument();
    expect(screen.getByText('Summer Sale')).toBeInTheDocument();
    expect(screen.getByText('FINE')).toBeInTheDocument();
    expect(screen.getByText('Shop Now')).toBeInTheDocument();
    expect(screen.getByText('Best headphones on the market')).toBeInTheDocument();
  });

  it('should render the banner image with alt text', () => {
    render(<HeroBanner heroBanner={mockBanner} />);

    const img = screen.getByAltText('headphones');
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', 'https://mock-image.com/banner.jpg');
  });

  it('should render the shop button', () => {
    render(<HeroBanner heroBanner={mockBanner} />);

    const button = screen.getByText('Shop Now');
    expect(button).toBeInTheDocument();
    expect(button.tagName).toBe('BUTTON');
  });

  it('should render the description section', () => {
    render(<HeroBanner heroBanner={mockBanner} />);

    expect(screen.getByText('Description')).toBeInTheDocument();
  });
});
