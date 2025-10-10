import { Link } from 'react-router-dom';
import { MapPin, Star, Navigation } from 'lucide-react';
import { Cinema } from '../services/api';

interface CinemaCardProps {
  cinema: Cinema;
}

export default function CinemaCard({ cinema }: CinemaCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden group">
      <div className="bg-gradient-to-r from-amber-500 to-orange-500 p-6 group-hover:from-orange-500 group-hover:to-amber-500 transition-all duration-300">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">{cinema.name}</h3>
        <div className="flex items-center justify-between text-gray-800">
          <div className="flex items-center space-x-1">
            <Star className="w-5 h-5 fill-gray-900" />
            <span className="font-bold">{cinema.rating}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Navigation className="w-4 h-4" />
            <span className="font-medium text-sm">{cinema.distance}</span>
          </div>
        </div>
      </div>

      <div className="p-6">
        <p className="text-gray-600 mb-6 flex items-start space-x-2">
          <MapPin className="w-4 h-4 mt-1 flex-shrink-0 text-gray-400" />
          <span>{cinema.location}</span>
        </p>

        <Link
          to={`/cinema/${cinema.id}`}
          className="block w-full bg-gradient-to-r from-gray-900 to-gray-800 text-white text-center py-3 rounded-lg font-semibold hover:from-gray-800 hover:to-gray-700 transition-all duration-300 transform hover:scale-105"
        >
          View Shows
        </Link>
      </div>
    </div>
  );
}
