import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import HeroBanner from '../../components/HeroBanner';

jest.mock('next/link', () => {
  return ({ children, href }) => <a href={href}>{children}</a>;
});

jest.mock('../../lib/client', () => ({
  urlFor: jest.fn((source) => `https://cdn.sanity.io/mock-image/${source}`),
}));

const mockBanner = {
  smallText: 'BEATS SOLO AIR',
  midText: 'Summer Sale',
  largeText1: 'FINE',
  buttonText: 'Shop Now',
  product: 'headphones',
  desc: 'Best headphones for the price',
  image: 'banner-image-ref',
};

describe('HeroBanner', () => {
  it('renders smallText', () => {
    render(<HeroBanner heroBanner={mockBanner} />);
    expect(screen.getByText('BEATS SOLO AIR')).toBeInTheDocument();
  });

  it('renders midText', () => {
    render(<HeroBanner heroBanner={mockBanner} />);
    expect(screen.getByText('Summer Sale')).toBeInTheDocument();
  });

  it('renders largeText1', () => {
    render(<HeroBanner heroBanner={mockBanner} />);
    expect(screen.getByText('FINE')).toBeInTheDocument();
  });

  it('renders the button with buttonText', () => {
    render(<HeroBanner heroBanner={mockBanner} />);
    expect(screen.getByRole('button', { name: 'Shop Now' })).toBeInTheDocument();
  });

  it('renders the description', () => {
    render(<HeroBanner heroBanner={mockBanner} />);
    expect(screen.getByText('Best headphones for the price')).toBeInTheDocument();
  });

  it('renders the hero banner image with alt text', () => {
    render(<HeroBanner heroBanner={mockBanner} />);
    const img = screen.getByAltText('headphones');
    expect(img).toBeInTheDocument();
  });

  it('links to the correct product page', () => {
    render(<HeroBanner heroBanner={mockBanner} />);
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/product/headphones');
  });

  it('has the hero-banner-container class', () => {
    const { container } = render(<HeroBanner heroBanner={mockBanner} />);
    expect(container.firstChild).toHaveClass('hero-banner-container');
  });

  it('renders the Description heading', () => {
    render(<HeroBanner heroBanner={mockBanner} />);
    expect(screen.getByText('Description')).toBeInTheDocument();
  });
});
