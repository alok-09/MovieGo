import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { bookingApi, CreateBookingPayload, convertBackendBookingToFrontend } from '../services/api';
import toast from 'react-hot-toast';

export interface Booking {
  id: string;
  movieId: string;
  movieTitle: string;
  moviePoster: string;
  cinemaName: string;
  cinemaId: string;
  showtime: string;
  showDate: string;
  seats: string[];
  totalAmount: number;
  bookingDate: string;
  status: 'confirmed' | 'cancelled';
}

interface BookingState {
  bookings: Booking[];
  currentSelection: {
    cinemaId: string | null;
    cinemaName: string | null;
    movieId: string | null;
    movieTitle: string | null;
    moviePoster: string | null;
    showtime: string | null;
    showDate: string | null;
    selectedSeats: string[];
  };
  setCurrentCinema: (id: string, name: string) => void;
  setCurrentMovie: (id: string, title: string, poster: string) => void;
  setShowtime: (showtime: string) => void;
  setShowDate: (date: string) => void;
  toggleSeat: (seat: string) => void;
  clearSelection: () => void;
  createBooking: (userId: string) => Promise<void>;
  cancelBooking: (id: string) => Promise<void>;
  loadBookings: (userId: string) => Promise<void>;
}

export const useBookingStore = create<BookingState>()(
  persist(
    (set, get) => ({
      bookings: [],
      currentSelection: {
        cinemaId: null,
        cinemaName: null,
        movieId: null,
        movieTitle: null,
        moviePoster: null,
        showtime: null,
        showDate: null,
        selectedSeats: [],
      },
      setCurrentCinema: (id, name) =>
        set((state) => ({
          currentSelection: {
            ...state.currentSelection,
            cinemaId: id,
            cinemaName: name,
          },
        })),
      setCurrentMovie: (id, title, poster) =>
        set((state) => ({
          currentSelection: {
            ...state.currentSelection,
            movieId: id,
            movieTitle: title,
            moviePoster: poster,
          },
        })),
      setShowtime: (showtime) =>
        set((state) => ({
          currentSelection: {
            ...state.currentSelection,
            showtime,
            selectedSeats: [],
          },
        })),
      setShowDate: (showDate) =>
        set((state) => ({
          currentSelection: {
            ...state.currentSelection,
            showDate,
            selectedSeats: [],
          },
        })),
      toggleSeat: (seat) =>
        set((state) => {
          const seats = state.currentSelection.selectedSeats;
          const newSeats = seats.includes(seat)
            ? seats.filter((s) => s !== seat)
            : seats.length < 6
            ? [...seats, seat]
            : seats;
          return {
            currentSelection: {
              ...state.currentSelection,
              selectedSeats: newSeats,
            },
          };
        }),
      clearSelection: () =>
        set({
          currentSelection: {
            cinemaId: null,
            cinemaName: null,
            movieId: null,
            movieTitle: null,
            moviePoster: null,
            showtime: null,
            showDate: null,
            selectedSeats: [],
          },
        }),
      createBooking: async (userId: string) => {
        const { currentSelection } = get();
        if (
          !currentSelection.movieId ||
          !currentSelection.cinemaId ||
          !currentSelection.showtime ||
          !currentSelection.showDate ||
          currentSelection.selectedSeats.length === 0
        ) {
          return;
        }

        try {
          const payload: CreateBookingPayload = {
            userId,
            cinemaId: currentSelection.cinemaId,
            imdbID: currentSelection.movieId,
            showtime: currentSelection.showtime,
            showDate: currentSelection.showDate!,
            showtimeId: 'default-showtime-id',
            seats: currentSelection.selectedSeats,
            totalPrice: currentSelection.selectedSeats.length * 200,
            movieTitle: currentSelection.movieTitle!,
            moviePoster: currentSelection.moviePoster!,
            cinemaName: currentSelection.cinemaName!,
          };

          const backendBooking = await bookingApi.createBooking(payload);
          const booking: Booking = {
            id: backendBooking._id,
            movieId: backendBooking.imdbID,
            movieTitle: backendBooking.movieTitle,
            moviePoster: currentSelection.moviePoster!,
            cinemaName: backendBooking.cinemaName,
            cinemaId: backendBooking.cinemaId,
            showtime: backendBooking.showtime,
            showDate: backendBooking.showDate,
            seats: backendBooking.seats,
            totalAmount: backendBooking.totalPrice,
            bookingDate: backendBooking.bookingDate,
            status: backendBooking.status,
          };

          set((state) => ({
            bookings: [booking, ...state.bookings],
          }));
        } catch (error) {
          console.error('Failed to create booking:', error);
          toast.error('Failed to create booking. Please try again.');
          throw error;
        }
      },
      cancelBooking: async (id) => {
        try {
          await bookingApi.cancelBooking(id);
          set((state) => ({
            bookings: state.bookings.map((booking) =>
              booking.id === id ? { ...booking, status: 'cancelled' as const } : booking
            ),
          }));
        } catch (error) {
          console.error('Failed to cancel booking:', error);
          toast.error('Failed to cancel booking. Please try again.');
          throw error;
        }
      },
      loadBookings: async (userId: string) => {
        try {
          const backendBookings = await bookingApi.getBookingsByUser(userId);
          const bookings: Booking[] = await Promise.all(
            backendBookings.map(async (bb) => {
              let moviePoster = '';
              try {
                const { getMovieById } = await import('../services/omdbApi');
                const movieDetails = await getMovieById(Number(bb.imdbID));
                moviePoster = movieDetails.poster_path
                  ? `https://image.tmdb.org/t/p/w500${movieDetails.poster_path}`
                  : 'https://via.placeholder.com/200x300?text=No+Poster';
              } catch (error) {
                console.error('Failed to fetch movie poster:', error);
                moviePoster = 'https://via.placeholder.com/200x300?text=No+Poster';
              }

              return {
                id: bb._id,
                movieId: bb.imdbID,
                movieTitle: bb.movieTitle,
                moviePoster,
                cinemaName: bb.cinemaName,
                cinemaId: bb.cinemaId,
                showtime: bb.showtime,
                showDate: bb.showDate,
                seats: bb.seats,
                totalAmount: bb.totalPrice,
                bookingDate: bb.bookingDate,
                status: bb.status,
              };
            })
          );
          set({ bookings });
        } catch (error) {
          console.error('Failed to load bookings:', error);
          toast.error('Failed to load bookings.');
        }
      },
    }),
    {
      name: 'radiant-cinemas-bookings',
    }
  )
);
