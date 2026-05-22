import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Footer from '../../components/Footer';

jest.mock('react-icons/ai', () => ({
  AiFillInstagram: () => <span data-testid="instagram-icon" />,
  AiOutlineTwitter: () => <span data-testid="twitter-icon" />,
}));

describe('Footer', () => {
  it('renders the copyright text', () => {
    render(<Footer />);
    expect(screen.getByText('2022 JSM Headphones All rights reserverd')).toBeInTheDocument();
  });

  it('renders the Instagram icon', () => {
    render(<Footer />);
    expect(screen.getByTestId('instagram-icon')).toBeInTheDocument();
  });

  it('renders the Twitter icon', () => {
    render(<Footer />);
    expect(screen.getByTestId('twitter-icon')).toBeInTheDocument();
  });

  it('has the footer-container class', () => {
    const { container } = render(<Footer />);
    expect(container.firstChild).toHaveClass('footer-container');
  });

  it('has the icons class on the icons paragraph', () => {
    render(<Footer />);
    const iconsParagraph = screen.getByTestId('instagram-icon').closest('p');
    expect(iconsParagraph).toHaveClass('icons');
  });
});
