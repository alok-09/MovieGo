import { useEffect, useState } from 'react';
import { Sparkles, Loader } from 'lucide-react';
import CinemaCard from '../components/CinemaCard';
import HeroCarousel from '../components/HeroCarousel';
import { cinemaApi, Cinema } from '../services/api';
import { getPopularMovies, Movie } from '../services/omdbApi';
import toast from 'react-hot-toast';

export default function HomePage() {
  const [cinemas, setCinemas] = useState<Cinema[]>([]);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [cinemasData, moviesData] = await Promise.all([
        cinemaApi.getAllCinemas(),
        getPopularMovies(),
      ]);
      setCinemas(cinemasData);
      setMovies(moviesData.results.slice(0, 5));
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {movies.length > 0 && <HeroCarousel movies={movies} />}

      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <Sparkles className="w-10 h-10 text-amber-500" />
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
              Premium Cinemas
            </h1>
            <Sparkles className="w-10 h-10 text-amber-500" />
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Book your favorite movies at premium cinemas across India
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader className="w-12 h-12 text-amber-500 animate-spin" />
          </div>
        ) : cinemas.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-xl text-gray-600">No cinemas available</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {cinemas.map((cinema) => (
              <CinemaCard key={cinema.id} cinema={cinema} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
