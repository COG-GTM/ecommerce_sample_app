import React from 'react';
import { render, screen } from '@testing-library/react';
import Footer from '../../components/Footer';

jest.mock('react-icons/ai', () => ({
  AiFillInstagram: () => <span data-testid="icon-instagram">ig</span>,
  AiOutlineTwitter: () => <span data-testid="icon-twitter">tw</span>,
}));

describe('Footer', () => {
  // ===== HAPPY PATH TESTS =====

  it('should render copyright text', () => {
    render(<Footer />);
    expect(screen.getByText(/2022 JSM Headphones All rights reserverd/i)).toBeInTheDocument();
  });

  it('should render social media icons', () => {
    render(<Footer />);
    expect(screen.getByTestId('icon-instagram')).toBeInTheDocument();
    expect(screen.getByTestId('icon-twitter')).toBeInTheDocument();
  });

  it('should have footer-container class', () => {
    const { container } = render(<Footer />);
    expect(container.querySelector('.footer-container')).toBeInTheDocument();
  });

  // ===== SAD PATH TESTS =====

  it('should render without crashing when no props are passed', () => {
    const { container } = render(<Footer />);
    expect(container).toBeTruthy();
  });
});
