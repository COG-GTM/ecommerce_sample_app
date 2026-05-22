import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import FooterBanner from '../../components/FooterBanner';

jest.mock('next/link', () => {
  return ({ children, href }) => <a href={href}>{children}</a>;
});

jest.mock('../../lib/client', () => ({
  urlFor: jest.fn((source) => `https://cdn.sanity.io/mock-image/${source}`),
}));

const mockFooterBanner = {
  discount: '20% OFF',
  largeText1: 'FINE',
  largeText2: 'SMILE',
  saleTime: '15 Nov to 7 Dec',
  smallText: 'Beats Solo Air',
  midText: 'Summer Sale',
  desc: 'See our new collection for discount items',
  product: 'headphones',
  buttonText: 'Shop Now',
  image: 'footer-image-ref',
};

describe('FooterBanner', () => {
  it('renders discount text', () => {
    render(<FooterBanner footerBanner={mockFooterBanner} />);
    expect(screen.getByText('20% OFF')).toBeInTheDocument();
  });

  it('renders largeText1 and largeText2', () => {
    render(<FooterBanner footerBanner={mockFooterBanner} />);
    expect(screen.getByText('FINE')).toBeInTheDocument();
    expect(screen.getByText('SMILE')).toBeInTheDocument();
  });

  it('renders saleTime', () => {
    render(<FooterBanner footerBanner={mockFooterBanner} />);
    expect(screen.getByText('15 Nov to 7 Dec')).toBeInTheDocument();
  });

  it('renders smallText and midText', () => {
    render(<FooterBanner footerBanner={mockFooterBanner} />);
    expect(screen.getByText('Beats Solo Air')).toBeInTheDocument();
    expect(screen.getByText('Summer Sale')).toBeInTheDocument();
  });

  it('renders description', () => {
    render(<FooterBanner footerBanner={mockFooterBanner} />);
    expect(screen.getByText('See our new collection for discount items')).toBeInTheDocument();
  });

  it('renders shop button with correct text', () => {
    render(<FooterBanner footerBanner={mockFooterBanner} />);
    expect(screen.getByRole('button', { name: 'Shop Now' })).toBeInTheDocument();
  });

  it('links to the correct product page', () => {
    render(<FooterBanner footerBanner={mockFooterBanner} />);
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/product/headphones');
  });

  it('renders the footer banner image', () => {
    render(<FooterBanner footerBanner={mockFooterBanner} />);
    const img = screen.getByRole('img');
    expect(img).toHaveClass('footer-banner-image');
  });

  it('has the footer-banner-container class', () => {
    const { container } = render(<FooterBanner footerBanner={mockFooterBanner} />);
    expect(container.firstChild).toHaveClass('footer-banner-container');
  });
});
