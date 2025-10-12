import { useState, useEffect } from 'react';
import { X, MapPin, Star, Loader } from 'lucide-react';
import { Cinema, cinemaApi } from '../services/api';
import toast from 'react-hot-toast';

interface CinemaSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCinema: (cinema: Cinema) => void;
  movieTitle: string;
}

export default function CinemaSelectionModal({
  isOpen,
  onClose,
  onSelectCinema,
  movieTitle,
}: CinemaSelectionModalProps) {
  const [cinemas, setCinemas] = useState<Cinema[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      loadCinemas();
    }
  }, [isOpen]);

  const loadCinemas = async () => {
    setLoading(true);
    try {
      const data = await cinemaApi.getAllCinemas();
      setCinemas(data);
    } catch (error) {
      console.error('Error loading cinemas:', error);
      toast.error('Failed to load cinemas');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
        <div className="bg-gradient-to-r from-amber-500 to-orange-500 p-6 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-white mb-1">Select Cinema</h2>
            <p className="text-white text-opacity-90">{movieTitle}</p>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-all duration-200"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <Loader className="w-12 h-12 text-amber-500 animate-spin" />
            </div>
          ) : cinemas.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-xl text-gray-600">No cinemas available</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {cinemas.map((cinema) => (
                <button
                  key={cinema.id}
                  onClick={() => onSelectCinema(cinema)}
                  className="bg-white border-2 border-gray-200 rounded-xl p-5 hover:border-amber-500 hover:shadow-lg transition-all duration-300 text-left group"
                >
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-amber-600 transition-colors">
                      {cinema.name}
                    </h3>
                    <div className="flex items-center space-x-1 bg-amber-100 px-2 py-1 rounded-full">
                      <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                      <span className="text-sm font-bold text-amber-700">{cinema.rating}</span>
                    </div>
                  </div>

                  <div className="flex items-start space-x-2 text-gray-600 mb-2">
                    <MapPin className="w-4 h-4 mt-1 flex-shrink-0" />
                    <span className="text-sm">{cinema.location}</span>
                  </div>

                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                    <span className="text-xs text-gray-500">{cinema.distance} away</span>
                    <span className="text-xs text-gray-500">{cinema.totalSeats} seats</span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
