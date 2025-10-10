import { useEffect, useState } from 'react';
import { X, Loader } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

interface SeatLayoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  showtimeId: string;
  movieTitle: string;
  cinemaName: string;
  date: string;
  time: string;
}

interface SeatUserInfo {
  userName: string;
  userEmail: string;
}

interface ShowtimeSeatDetails {
  showtime: {
    _id: string;
    bookedSeats: string[];
    totalSeats: number;
    availableSeats: number;
  };
  seatUserMap: Record<string, SeatUserInfo>;
}

const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
const seatsPerRow = 10;

const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export default function SeatLayoutModal({
  isOpen,
  onClose,
  showtimeId,
  movieTitle,
  cinemaName,
  date,
  time,
}: SeatLayoutModalProps) {
  const [seatDetails, setSeatDetails] = useState<ShowtimeSeatDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const [hoveredSeat, setHoveredSeat] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && showtimeId) {
      fetchSeatDetails();
    }
  }, [isOpen, showtimeId]);

  const fetchSeatDetails = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/showtimes/${showtimeId}/seat-details`);
      setSeatDetails(response.data);
    } catch (error) {
      toast.error('Failed to load seat details');
      console.error('Error fetching seat details:', error);
    } finally {
      setLoading(false);
    }
  };

  const isSeatBooked = (seatId: string) => {
    return seatDetails?.showtime.bookedSeats.includes(seatId) || false;
  };

  const getSeatUserInfo = (seatId: string): SeatUserInfo | null => {
    return seatDetails?.seatUserMap[seatId] || null;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl z-10">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Seat Layout</h2>
            <p className="text-sm text-gray-600 mt-1">
              {movieTitle} at {cinemaName}
            </p>
            <p className="text-sm text-gray-500">
              {date} at {time}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-lg"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader className="w-12 h-12 text-blue-600 animate-spin" />
            </div>
          ) : seatDetails ? (
            <>
              <div className="mb-6 grid grid-cols-3 gap-4 text-center">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm font-medium text-blue-600">Total Seats</p>
                  <p className="text-2xl font-bold text-blue-900">{seatDetails.showtime.totalSeats}</p>
                </div>
                <div className="bg-red-50 p-4 rounded-lg">
                  <p className="text-sm font-medium text-red-600">Booked</p>
                  <p className="text-2xl font-bold text-red-900">{seatDetails.showtime.bookedSeats.length}</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-sm font-medium text-green-600">Available</p>
                  <p className="text-2xl font-bold text-green-900">{seatDetails.showtime.availableSeats}</p>
                </div>
              </div>

              <div className="bg-gray-900 text-white text-center py-4 rounded-t-3xl mb-8 shadow-lg">
                <p className="text-lg font-semibold">Screen This Way</p>
                <div className="w-3/4 mx-auto h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent mt-2"></div>
              </div>

              <div className="space-y-3 mb-8">
                {rows.map((row) => (
                  <div key={row} className="flex items-center justify-center space-x-3">
                    <span className="w-8 text-center font-bold text-gray-700">{row}</span>
                    <div className="flex space-x-2">
                      {Array.from({ length: seatsPerRow }, (_, i) => {
                        const seatNumber = i + 1;
                        const seatId = `${row}${seatNumber}`;
                        const isBooked = isSeatBooked(seatId);
                        const userInfo = getSeatUserInfo(seatId);
                        const isHovered = hoveredSeat === seatId;

                        return (
                          <div key={seatId} className="relative">
                            <button
                              onMouseEnter={() => setHoveredSeat(seatId)}
                              onMouseLeave={() => setHoveredSeat(null)}
                              className={`w-10 h-10 rounded-lg transition-all duration-200 ${
                                isBooked
                                  ? 'bg-red-500 cursor-default'
                                  : 'bg-green-500 cursor-default'
                              } flex items-center justify-center text-white text-xs font-semibold shadow-md ${
                                isBooked && 'hover:shadow-lg'
                              }`}
                            >
                              {seatNumber}
                            </button>
                            {isBooked && userInfo && isHovered && (
                              <div className="absolute z-20 bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-48 bg-gray-900 text-white text-xs rounded-lg p-3 shadow-xl">
                                <div className="font-semibold mb-1">{userInfo.userName}</div>
                                <div className="text-gray-300">{userInfo.userEmail}</div>
                                <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1">
                                  <div className="border-4 border-transparent border-t-gray-900"></div>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-center items-center space-x-8 bg-gray-100 p-6 rounded-xl">
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 bg-green-500 rounded"></div>
                  <span className="text-sm font-medium text-gray-700">Available</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 bg-red-500 rounded"></div>
                  <span className="text-sm font-medium text-gray-700">Booked</span>
                </div>
              </div>

              <p className="text-center text-sm text-gray-500 mt-4">
                Hover over booked seats to see user information
              </p>
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600">No seat information available</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
