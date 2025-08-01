import { render, screen } from '@testing-library/react';
import App from './App';

test('renders IMS link', () => {
  render(<App />);
  const linkElement = screen.getByText(/IMS/i);
  expect(linkElement).toBeInTheDocument();
});
