import React from 'react';
import { render, screen } from '@testing-library/react';
import FooterBanner from '../../components/FooterBanner';

jest.mock('../../lib/client', () => ({
  urlFor: jest.fn((source) => `https://cdn.sanity.io/mock/${source}`),
}));

const mockFooterBanner = {
  discount: '20% OFF',
  largeText1: 'Fine',
  largeText2: 'Smile',
  saleTime: '15 Nov to 7 Dec',
  smallText: 'Beats Solo Air',
  midText: 'Summer Sale',
  desc: 'See discounts on selected headphones',
  product: 'headphones',
  buttonText: 'Shop Now',
  image: 'footer-image-ref',
};

describe('FooterBanner', () => {
  // ===== HAPPY PATH TESTS =====

  it('should render discount text', () => {
    render(<FooterBanner footerBanner={mockFooterBanner} />);
    expect(screen.getByText('20% OFF')).toBeInTheDocument();
  });

  it('should render large text lines', () => {
    render(<FooterBanner footerBanner={mockFooterBanner} />);
    expect(screen.getByText('Fine')).toBeInTheDocument();
    expect(screen.getByText('Smile')).toBeInTheDocument();
  });

  it('should render sale time', () => {
    render(<FooterBanner footerBanner={mockFooterBanner} />);
    expect(screen.getByText('15 Nov to 7 Dec')).toBeInTheDocument();
  });

  it('should render the description', () => {
    render(<FooterBanner footerBanner={mockFooterBanner} />);
    expect(screen.getByText('See discounts on selected headphones')).toBeInTheDocument();
  });

  it('should render a button that links to the product', () => {
    render(<FooterBanner footerBanner={mockFooterBanner} />);
    const button = screen.getByRole('button', { name: 'Shop Now' });
    expect(button).toBeInTheDocument();
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/product/headphones');
  });

  it('should render the banner image', () => {
    render(<FooterBanner footerBanner={mockFooterBanner} />);
    const img = screen.getByRole('img');
    expect(img).toHaveClass('footer-banner-image');
  });

  // ===== SAD PATH TESTS =====

  it('should handle empty string values without crashing', () => {
    const emptyBanner = {
      discount: '',
      largeText1: '',
      largeText2: '',
      saleTime: '',
      smallText: '',
      midText: '',
      desc: '',
      product: '',
      buttonText: '',
      image: null,
    };
    const { container } = render(<FooterBanner footerBanner={emptyBanner} />);
    expect(container.querySelector('.footer-banner-container')).toBeInTheDocument();
  });
});
