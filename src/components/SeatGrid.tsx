import { useEffect, useState } from 'react';
import { useBookingStore } from '../store/bookingStore';
import { showtimeApi } from '../services/api';
import toast from 'react-hot-toast';
import { Loader } from 'lucide-react';

const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
const seatsPerRow = 10;

export default function SeatGrid() {
  const { currentSelection, toggleSeat } = useBookingStore();
  const selectedSeats = currentSelection.selectedSeats;
  const [bookedSeats, setBookedSeats] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBookedSeats();
  }, [currentSelection.cinemaId, currentSelection.movieId, currentSelection.showDate, currentSelection.showtime]);

  const loadBookedSeats = async () => {
    if (!currentSelection.cinemaId || !currentSelection.movieId || !currentSelection.showDate || !currentSelection.showtime) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const seats = await showtimeApi.getBookedSeats(
        currentSelection.cinemaId,
        currentSelection.movieId,
        currentSelection.showDate,
        currentSelection.showtime
      );
      setBookedSeats(seats);
    } catch (error) {
      console.error('Failed to load booked seats:', error);
      toast.error('Failed to load seat availability');
    } finally {
      setLoading(false);
    }
  };

  const handleSeatClick = (seat: string) => {
    if (bookedSeats.includes(seat)) {
      toast.error('This seat is already booked');
      return;
    }

    if (!selectedSeats.includes(seat) && selectedSeats.length >= 6) {
      toast.error('Maximum 6 seats can be selected');
      return;
    }

    toggleSeat(seat);
  };

  const getSeatClass = (seat: string) => {
    if (bookedSeats.includes(seat)) {
      return 'bg-red-500 cursor-not-allowed';
    }
    if (selectedSeats.includes(seat)) {
      return 'bg-blue-500 hover:bg-blue-600 cursor-pointer';
    }
    return 'bg-green-500 hover:bg-green-600 cursor-pointer';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader className="w-12 h-12 text-amber-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="bg-gray-900 text-white text-center py-3 sm:py-4 rounded-t-3xl mb-6 sm:mb-8 shadow-lg">
        <p className="text-base sm:text-lg font-semibold">Screen This Way</p>
        <div className="w-3/4 mx-auto h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent mt-2"></div>
      </div>

      <div className="overflow-x-auto pb-4">
        <div className="min-w-max space-y-2 sm:space-y-3 mb-6 sm:mb-8">
          {rows.map((row) => (
            <div key={row} className="flex items-center justify-center space-x-2 sm:space-x-3">
              <span className="w-6 sm:w-8 text-center font-bold text-gray-700 text-sm sm:text-base">{row}</span>
              <div className="flex space-x-1 sm:space-x-2">
                {Array.from({ length: seatsPerRow }, (_, i) => {
                  const seatNumber = i + 1;
                  const seatId = `${row}${seatNumber}`;
                  return (
                    <button
                      key={seatId}
                      onClick={() => handleSeatClick(seatId)}
                      className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg transition-all duration-200 transform hover:scale-110 ${getSeatClass(
                        seatId
                      )} flex items-center justify-center text-white text-xs font-semibold shadow-md`}
                      disabled={bookedSeats.includes(seatId)}
                    >
                      {seatNumber}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-6 lg:gap-8 bg-gray-100 p-4 sm:p-6 rounded-xl">
        <div className="flex items-center space-x-2">
          <div className="w-5 h-5 sm:w-6 sm:h-6 bg-green-500 rounded"></div>
          <span className="text-xs sm:text-sm font-medium text-gray-700">Available</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-5 h-5 sm:w-6 sm:h-6 bg-red-500 rounded"></div>
          <span className="text-xs sm:text-sm font-medium text-gray-700">Booked</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-5 h-5 sm:w-6 sm:h-6 bg-blue-500 rounded"></div>
          <span className="text-xs sm:text-sm font-medium text-gray-700">Selected</span>
        </div>
      </div>
    </div>
  );
}
