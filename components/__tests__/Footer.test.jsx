import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Footer from '../Footer';

jest.mock('react-icons/ai', () => ({
  AiFillInstagram: () => <span data-testid="instagram-icon">Instagram</span>,
  AiOutlineTwitter: () => <span data-testid="twitter-icon">Twitter</span>,
}));

describe('Footer', () => {
  it('renders copyright text', () => {
    render(<Footer />);
    expect(screen.getByText('2022 JSM Headphones All rights reserverd')).toBeInTheDocument();
  });

  it('renders Instagram icon', () => {
    render(<Footer />);
    expect(screen.getByTestId('instagram-icon')).toBeInTheDocument();
  });

  it('renders Twitter icon', () => {
    render(<Footer />);
    expect(screen.getByTestId('twitter-icon')).toBeInTheDocument();
  });
});
