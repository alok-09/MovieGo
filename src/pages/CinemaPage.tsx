import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, Search, Loader } from 'lucide-react';
import MovieCard from '../components/MovieCard';
import { searchMovies, getNowPlayingMovies, MovieListItem } from '../services/omdbApi';
import { cinemaApi, Cinema } from '../services/api';
import { useBookingStore } from '../store/bookingStore';
import toast from 'react-hot-toast';

export default function CinemaPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [cinema, setCinema] = useState<Cinema | null>(null);
  const [movies, setMovies] = useState<MovieListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const { setCurrentCinema } = useBookingStore();

  useEffect(() => {
    if (!id) {
      navigate('/');
      return;
    }
    loadCinemaAndMovies();
  }, [id]);

  const loadCinemaAndMovies = async () => {
    setLoading(true);
    try {
      const cinemaData = await cinemaApi.getCinemaById(id!);
      if (!cinemaData) {
        toast.error('Cinema not found');
        navigate('/');
        return;
      }
      setCinema(cinemaData);
      setCurrentCinema(cinemaData.id, cinemaData.name);
      await loadMovies();
    } catch (error) {
      console.error('Error loading cinema:', error);
      toast.error('Failed to load cinema');
      navigate('/');
    }
  };

  const loadMovies = async (query?: string) => {
    try {
      if (query) {
        const results = await searchMovies(query);
        console.log('Search results:', results);
        if (results.length > 0) {
          setMovies(results);
        } else {
          toast.error('No movies found');
          setMovies([]);
        }
      } else {
        const results = await getNowPlayingMovies();
        console.log('Now playing movies:', results);
        setMovies(results);
      }
    } catch (error) {
      console.error('Error loading movies:', error);
      toast.error('Failed to load movies');
      setMovies([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      loadMovies(searchQuery);
    }
  };

  if (!cinema) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-12 shadow-xl">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{cinema.name}</h1>
          <div className="flex items-center space-x-2 text-gray-300 mb-6">
            <MapPin className="w-5 h-5" />
            <span className="text-lg">{cinema.location}</span>
          </div>

          <form onSubmit={handleSearch} className="max-w-2xl">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for movies..."
                className="w-full px-6 py-4 rounded-full text-gray-900 bg-white focus:outline-none focus:ring-4 focus:ring-amber-400 pr-14"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-gradient-to-r from-amber-500 to-orange-500 text-white p-3 rounded-full hover:from-orange-500 hover:to-amber-500 transition-all duration-300"
              >
                <Search className="w-5 h-5" />
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Now Showing</h2>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader className="w-12 h-12 text-amber-500 animate-spin" />
          </div>
        ) : movies.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-xl text-gray-600">No movies available</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {movies.map((movie) => (
              <MovieCard
                key={movie.imdbID}
                movie={movie}
                cinemaId={cinema.id}
                cinemaName={cinema.name}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
