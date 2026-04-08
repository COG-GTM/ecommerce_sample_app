import React from 'react';
import { render, screen } from '@testing-library/react';
import Footer from '../../components/Footer';

jest.mock('react-icons/ai', () => ({
  AiFillInstagram: () => <span data-testid="instagram-icon" />,
  AiOutlineTwitter: () => <span data-testid="twitter-icon" />,
}));

describe('Footer', () => {
  it('should render the copyright text (happy path)', () => {
    render(<Footer />);
    expect(screen.getByText(/2022 JSM Headphones All rights reserverd/i)).toBeInTheDocument();
  });

  it('should render social media icons', () => {
    render(<Footer />);
    expect(screen.getByTestId('instagram-icon')).toBeInTheDocument();
    expect(screen.getByTestId('twitter-icon')).toBeInTheDocument();
  });
});
