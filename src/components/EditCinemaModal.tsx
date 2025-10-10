import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

interface EditCinemaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (id: string, cinema: CinemaFormData) => void;
  isLoading?: boolean;
  cinema: Cinema | null;
}

export interface CinemaFormData {
  name: string;
  location: string;
  distance: string;
  rating: number;
  totalSeats: number;
}

export interface Cinema {
  _id: string;
  name: string;
  location: string;
  distance: string;
  rating: number;
  totalSeats: number;
}

function EditCinemaModal({ isOpen, onClose, onUpdate, isLoading = false, cinema }: EditCinemaModalProps) {
  const [formData, setFormData] = useState<CinemaFormData>({
    name: '',
    location: '',
    distance: '',
    rating: 4.0,
    totalSeats: 100,
  });

  useEffect(() => {
    if (cinema) {
      setFormData({
        name: cinema.name,
        location: cinema.location,
        distance: cinema.distance,
        rating: cinema.rating,
        totalSeats: cinema.totalSeats,
      });
    }
  }, [cinema]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (cinema) {
      onUpdate(cinema._id, formData);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) : value,
    }));
  };

  if (!isOpen || !cinema) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Edit Cinema</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            disabled={isLoading}
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Cinema Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., Grand Cinema Palace"
              disabled={isLoading}
            />
          </div>

          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
              Location
            </label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., 123 Main St, Downtown"
              disabled={isLoading}
            />
          </div>

          <div>
            <label htmlFor="distance" className="block text-sm font-medium text-gray-700 mb-1">
              Distance
            </label>
            <input
              type="text"
              id="distance"
              name="distance"
              value={formData.distance}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., 2.5 km"
              disabled={isLoading}
            />
          </div>

          <div>
            <label htmlFor="rating" className="block text-sm font-medium text-gray-700 mb-1">
              Rating (0-5)
            </label>
            <input
              type="number"
              id="rating"
              name="rating"
              value={formData.rating}
              onChange={handleChange}
              required
              min="0"
              max="5"
              step="0.1"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={isLoading}
            />
          </div>

          <div>
            <label htmlFor="totalSeats" className="block text-sm font-medium text-gray-700 mb-1">
              Total Seats
            </label>
            <input
              type="number"
              id="totalSeats"
              name="totalSeats"
              value={formData.totalSeats}
              onChange={handleChange}
              required
              min="1"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={isLoading}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:bg-blue-400 disabled:cursor-not-allowed"
              disabled={isLoading}
            >
              {isLoading ? 'Updating...' : 'Update Cinema'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditCinemaModal;
