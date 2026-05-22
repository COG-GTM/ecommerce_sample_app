import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import HeroBanner from '../HeroBanner';

jest.mock('../../lib/client', () => ({
  urlFor: jest.fn(() => ({
    toString: () => 'https://mock-image.com/banner.webp',
  })),
}));

const mockBanner = {
  smallText: 'BEATS SOLO AIR',
  midText: 'Summer Sale',
  largeText1: 'FINE',
  image: { asset: { _ref: 'image-banner' } },
  product: 'headphone',
  buttonText: 'Shop Now',
  desc: 'Best headphones on the market',
};

describe('HeroBanner', () => {
  beforeEach(() => {
    render(<HeroBanner heroBanner={mockBanner} />);
  });

  it('renders smallText', () => {
    expect(screen.getByText('BEATS SOLO AIR')).toBeInTheDocument();
  });

  it('renders midText', () => {
    expect(screen.getByText('Summer Sale')).toBeInTheDocument();
  });

  it('renders largeText1', () => {
    expect(screen.getByText('FINE')).toBeInTheDocument();
  });

  it('renders a link to the product page', () => {
    const button = screen.getByText('Shop Now');
    expect(button).toBeInTheDocument();
    expect(button.tagName).toBe('BUTTON');
  });

  it('renders buttonText', () => {
    expect(screen.getByText('Shop Now')).toBeInTheDocument();
  });

  it('renders description', () => {
    expect(screen.getByText('Best headphones on the market')).toBeInTheDocument();
  });

  it('renders banner image', () => {
    const img = screen.getByAltText('headphones');
    expect(img).toBeInTheDocument();
  });
});
