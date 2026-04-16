import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Restaurants from '../Restaurants';

// Mock axios
jest.mock('axios', () => ({
  get: jest.fn(),
}));

const mockRestaurants = [
  {
    _id: '1',
    name: 'Sushi Sensation',
    address: {
      street: '789 Cherry Lane',
      city: 'New York',
      state: 'NY',
      zipCode: '10003',
    },
    phone: '+1-555-0789',
    image: 'https://example.com/sushi.jpg',
  },
  {
    _id: '2',
    name: 'Curry House',
    address: {
      street: '654 Maple Road',
      city: 'New York',
      state: 'NY',
      zipCode: '10005',
    },
    phone: '+1-555-0654',
    image: '',
  },
];

describe('Restaurants Page', () => {
  test('renders loading state initially', () => {
    render(
      <BrowserRouter>
        <Restaurants />
      </BrowserRouter>
    );
    expect(screen.getByText(/Loading restaurants/i)).toBeInTheDocument();
  });

  test('renders restaurants after fetch', async () => {
    axios.get.mockResolvedValueOnce({ data: mockRestaurants });

    render(
      <BrowserRouter>
        <Restaurants />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Sushi Sensation')).toBeInTheDocument();
      expect(screen.getByText('Curry House')).toBeInTheDocument();
    });

    expect(screen.getAllByRole('link')).toHaveLength(mockRestaurants.length);
  });

  test('renders error message on fetch failure', async () => {
    axios.get.mockRejectedValueOnce(new Error('Network Error'));

    render(
      <BrowserRouter>
        <Restaurants />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/Failed to fetch restaurants/i)).toBeInTheDocument();
    });
  });
});
