import React from 'react';
import { render, screen } from '@testing-library/react';
import FooterBanner from '../../components/FooterBanner';

jest.mock('../../lib/client', () => ({
  urlFor: jest.fn(() => 'https://mock-image.com/footer.jpg'),
}));

const mockBanner = {
  discount: '20% OFF',
  largeText1: 'Fine',
  largeText2: 'Smile',
  saleTime: '15 Nov to 7 Dec',
  smallText: 'Beats Solo',
  midText: 'Summer Sale',
  desc: 'See what they say about us',
  product: 'headphones',
  buttonText: 'Shop Now',
  image: 'footer-image-ref',
};

describe('FooterBanner', () => {
  it('should render all banner text content (happy path)', () => {
    render(<FooterBanner footerBanner={mockBanner} />);

    expect(screen.getByText('20% OFF')).toBeInTheDocument();
    expect(screen.getByText('Fine')).toBeInTheDocument();
    expect(screen.getByText('Smile')).toBeInTheDocument();
    expect(screen.getByText('15 Nov to 7 Dec')).toBeInTheDocument();
    expect(screen.getByText('Beats Solo')).toBeInTheDocument();
    expect(screen.getByText('Summer Sale')).toBeInTheDocument();
    expect(screen.getByText('See what they say about us')).toBeInTheDocument();
  });

  it('should render Shop Now button', () => {
    render(<FooterBanner footerBanner={mockBanner} />);

    const button = screen.getByText('Shop Now');
    expect(button).toBeInTheDocument();
    expect(button.tagName).toBe('BUTTON');
  });

  it('should render the footer banner image', () => {
    render(<FooterBanner footerBanner={mockBanner} />);

    const img = screen.getByRole('img');
    expect(img).toHaveAttribute('src', 'https://mock-image.com/footer.jpg');
    expect(img).toHaveClass('footer-banner-image');
  });
});
