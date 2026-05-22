import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import FooterBanner from '../FooterBanner';

jest.mock('../../lib/client', () => ({
  urlFor: jest.fn(() => ({
    toString: () => 'https://mock-image.com/footer-banner.webp',
  })),
}));

const mockBanner = {
  discount: '20% OFF',
  largeText1: 'FINE',
  largeText2: 'SMILE',
  saleTime: '15 Nov to 7 Dec',
  smallText: 'Beats Solo',
  midText: 'Summer Sale',
  desc: 'See discounts on our best products',
  product: 'headphone',
  buttonText: 'Shop Now',
  image: { asset: { _ref: 'image-footer' } },
};

describe('FooterBanner', () => {
  beforeEach(() => {
    render(<FooterBanner footerBanner={mockBanner} />);
  });

  it('renders discount', () => {
    expect(screen.getByText('20% OFF')).toBeInTheDocument();
  });

  it('renders largeText1', () => {
    expect(screen.getByText('FINE')).toBeInTheDocument();
  });

  it('renders largeText2', () => {
    expect(screen.getByText('SMILE')).toBeInTheDocument();
  });

  it('renders saleTime', () => {
    expect(screen.getByText('15 Nov to 7 Dec')).toBeInTheDocument();
  });

  it('renders smallText', () => {
    expect(screen.getByText('Beats Solo')).toBeInTheDocument();
  });

  it('renders midText', () => {
    expect(screen.getByText('Summer Sale')).toBeInTheDocument();
  });

  it('renders desc', () => {
    expect(screen.getByText('See discounts on our best products')).toBeInTheDocument();
  });

  it('renders button with buttonText', () => {
    const button = screen.getByText('Shop Now');
    expect(button).toBeInTheDocument();
    expect(button.tagName).toBe('BUTTON');
  });

  it('renders footer banner image', () => {
    const img = screen.getByRole('img');
    expect(img).toBeInTheDocument();
  });
});
