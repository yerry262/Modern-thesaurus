import { render, screen } from '@testing-library/react';
import App from './App';

test('renders Modern Thesaurus header', () => {
  render(<App />);
  const heading = screen.getByText(/Modern Thesaurus/i);
  expect(heading).toBeInTheDocument();
});

test('renders Add Word button', () => {
  render(<App />);
  const addBtn = screen.getByText(/Add Word/i);
  expect(addBtn).toBeInTheDocument();
});

test('renders period toggle buttons', () => {
  render(<App />);
  expect(screen.getByText(/Today/i)).toBeInTheDocument();
  expect(screen.getByText(/This Week/i)).toBeInTheDocument();
});
