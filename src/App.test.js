import { render, screen } from '@testing-library/react';
import App from './App';
import MainLayout from './components/layout';

test('renders learn react link', () => {
  render(<App />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
