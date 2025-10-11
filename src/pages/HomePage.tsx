import { useEffect, useState } from 'react';
import { Film, Sparkles, Loader, Calendar, MapPin, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import CinemaCard from '../components/CinemaCard';
import HeroCarousel from '../components/HeroCarousel';
import MovieCarousel from '../components/MovieCarousel';
import { cinemaApi, Cinema } from '../services/api';
import { getPopularMovies, getNowPlayingMovies, getUpcomingMovies, Movie } from '../services/omdbApi';
import toast from 'react-hot-toast';

export default function HomePage() {
  const navigate = useNavigate();
  const [cinemas, setCinemas] = useState<Cinema[]>([]);
  const [featuredMovies, setFeaturedMovies] = useState<Movie[]>([]);
  const [nowPlayingMovies, setNowPlayingMovies] = useState<Movie[]>([]);
  const [upcomingMovies, setUpcomingMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [cinemasData, featuredData, nowPlayingData, upcomingData] = await Promise.all([
        cinemaApi.getAllCinemas(),
        getPopularMovies(),
        getNowPlayingMovies(),
        getUpcomingMovies(),
      ]);
      setCinemas(cinemasData);
      setFeaturedMovies(featuredData.results.slice(0, 5));

      const nowPlayingTMDB = nowPlayingData.map((movie: any) => ({
        id: parseInt(movie.imdbID),
        title: movie.Title,
        poster_path: movie.Poster.replace('https://image.tmdb.org/t/p/w500', ''),
        backdrop_path: null,
        release_date: movie.Year,
        vote_average: movie.vote_average || 0,
        overview: '',
        genre_ids: []
      }));
      setNowPlayingMovies(nowPlayingTMDB.slice(0, 12));
      setUpcomingMovies(upcomingData.results.slice(0, 12));
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex justify-center items-center">
        <Loader className="w-12 h-12 text-amber-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {featuredMovies.length > 0 && <HeroCarousel movies={featuredMovies} />}

      <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-12 sm:space-y-16">
        {nowPlayingMovies.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-6 sm:mb-8">
              <div className="flex items-center space-x-3">
                <div className="bg-amber-500 p-2 rounded-lg">
                  <Film className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">
                  Now Playing
                </h2>
              </div>
            </div>
            <MovieCarousel movies={nowPlayingMovies} />
          </section>
        )}

        {upcomingMovies.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-6 sm:mb-8">
              <div className="flex items-center space-x-3">
                <div className="bg-amber-500 p-2 rounded-lg">
                  <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">
                  Coming Soon
                </h2>
              </div>
            </div>
            <MovieCarousel movies={upcomingMovies} />
          </section>
        )}

        {cinemas.length > 0 && (
          <section className="py-8 sm:py-12">
            <div className="text-center mb-8 sm:mb-12">
              <div className="flex items-center justify-center space-x-3 mb-4">
                <MapPin className="w-8 h-8 sm:w-10 sm:h-10 text-amber-500" />
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900">
                  Featured Cinemas
                </h2>
                <Sparkles className="w-8 h-8 sm:w-10 sm:h-10 text-amber-500" />
              </div>
              <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
                Experience movies at premium cinemas with world-class facilities
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
              {cinemas.slice(0, 8).map((cinema) => (
                <CinemaCard key={cinema.id} cinema={cinema} />
              ))}
            </div>

            {cinemas.length > 8 && (
              <div className="text-center mt-8 sm:mt-12">
                <button
                  onClick={() => navigate('/cinemas')}
                  className="inline-flex items-center space-x-2 bg-amber-500 hover:bg-amber-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-bold text-base sm:text-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <span>View All Cinemas</span>
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </section>
        )}
      </div>
    </div>
  );
}
