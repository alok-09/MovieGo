import axios from 'axios';
import { Booking } from '../store/bookingStore';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

export interface CreateBookingPayload {
  userId: string;
  cinemaId: string;
  imdbID: string;
  showtime: string;
  showDate: string;
  showtimeId: string;
  seats: string[];
  totalPrice: number;
  movieTitle: string;
  moviePoster: string;
  cinemaName: string;
}

export interface BackendBooking {
  _id: string;
  userId: string;
  cinemaId: string;
  cinemaName: string;
  movieTitle: string;
  imdbID: string;
  showtime: string;
  showDate: string;
  seats: string[];
  totalPrice: number;
  bookingDate: string;
  status: 'confirmed' | 'cancelled';
}

export const bookingApi = {
  createBooking: async (payload: CreateBookingPayload): Promise<BackendBooking> => {
    const response = await api.post('/bookings', payload);
    return response.data;
  },

  getBookingsByUser: async (userId: string): Promise<BackendBooking[]> => {
    const response = await api.get(`/bookings/user/${userId}`);
    return response.data;
  },

  cancelBooking: async (bookingId: string): Promise<BackendBooking> => {
    const response = await api.patch(`/bookings/${bookingId}/cancel`);
    return response.data;
  },
};

export const convertBackendBookingToFrontend = (backendBooking: BackendBooking): Booking => {
  return {
    id: backendBooking._id,
    movieId: backendBooking.imdbID,
    movieTitle: backendBooking.movieTitle,
    moviePoster: '',
    cinemaName: backendBooking.cinemaName,
    cinemaId: backendBooking.cinemaId,
    showtime: backendBooking.showtime,
    seats: backendBooking.seats,
    totalAmount: backendBooking.totalPrice,
    bookingDate: backendBooking.bookingDate,
    status: backendBooking.status,
  };
};

export interface BackendCinema {
  _id: string;
  name: string;
  location: string;
  distance: string;
  rating: number;
  totalSeats: number;
}

export interface Cinema {
  id: string;
  name: string;
  location: string;
  distance: string;
  rating: number;
  totalSeats: number;
}

export const cinemaApi = {
  getAllCinemas: async (): Promise<Cinema[]> => {
    const response = await api.get('/cinemas');
    return response.data.map((cinema: BackendCinema) => ({
      id: cinema._id,
      name: cinema.name,
      location: cinema.location,
      distance: cinema.distance,
      rating: cinema.rating,
      totalSeats: cinema.totalSeats,
    }));
  },

  getCinemaById: async (id: string): Promise<Cinema | null> => {
    try {
      const response = await api.get(`/cinemas/${id}`);
      const cinema: BackendCinema = response.data;
      return {
        id: cinema._id,
        name: cinema.name,
        location: cinema.location,
        distance: cinema.distance,
        rating: cinema.rating,
        totalSeats: cinema.totalSeats,
      };
    } catch (error) {
      return null;
    }
  },
};

export interface BackendShowtime {
  _id: string;
  cinemaId: string;
  imdbID: string;
  date: string;
  time: string;
  price: number;
  totalSeats: number;
  availableSeats: number;
  bookedSeats: string[];
}

export const showtimeApi = {
  getShowtimesByCinemaAndMovie: async (
    cinemaId: string,
    movieId: string
  ): Promise<BackendShowtime[]> => {
    try {
      const response = await api.get(`/showtimes/cinema/${cinemaId}/movie/${movieId}`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch showtimes:', error);
      return [];
    }
  },

  getBookedSeats: async (
    cinemaId: string,
    imdbID: string,
    date: string,
    time: string
  ): Promise<string[]> => {
    try {
      const response = await api.get('/showtimes/booked-seats', {
        params: { cinemaId, imdbID, date, time },
      });
      return response.data.bookedSeats || [];
    } catch (error) {
      console.error('Failed to fetch booked seats:', error);
      return [];
    }
  },
};
