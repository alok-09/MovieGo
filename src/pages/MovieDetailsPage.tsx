import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, Star, Loader, Film, Play } from 'lucide-react';
import { getMovieDetailsWithCredits, getMovieVideos, MovieDetailsWithCredits } from '../services/omdbApi';
import { useBookingStore } from '../store/bookingStore';
import ShowtimeSelectionModal from '../components/ShowtimeSelectionModal';
import TrailerModal from '../components/TrailerModal';
import toast from 'react-hot-toast';

export default function MovieDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [movie, setMovie] = useState<MovieDetailsWithCredits | null>(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showTrailerModal, setShowTrailerModal] = useState(false);
  const [trailerKey, setTrailerKey] = useState<string | null>(null);
  const bookingStore = useBookingStore();

  useEffect(() => {
    if (!id) {
      navigate('/');
      return;
    }

    loadMovieDetails();
  }, [id]);

  const loadMovieDetails = async () => {
    setLoading(true);
    try {
      const movieId = parseInt(id!);
      const details = await getMovieDetailsWithCredits(movieId);
      setMovie(details);

      const videos = await getMovieVideos(movieId);
      const trailer = videos.results?.find(
        (video: any) => video.type === 'Trailer' && video.site === 'YouTube'
      );
      if (trailer) {
        setTrailerKey(trailer.key);
      }
    } catch (error) {
      console.error('Error loading movie details:', error);
      toast.error('Failed to load movie details');
      navigate(-1);
    } finally {
      setLoading(false);
    }
  };

  const handleWatchTrailer = () => {
    if (trailerKey) {
      setShowTrailerModal(true);
    } else {
      toast.error('No trailer available for this movie');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex justify-center items-center">
        <Loader className="w-12 h-12 text-amber-500 animate-spin" />
      </div>
    );
  }

  if (!movie) {
    return null;
  }

  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : 'https://via.placeholder.com/500x750?text=No+Poster';

  const backdropUrl = movie.backdrop_path
    ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
    : null;

  const formatRuntime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="relative">
        {backdropUrl && (
          <div className="absolute inset-0 w-full h-[900px] sm:h-[950px] md:h-[800px] overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/80 to-gray-900/40 z-10"></div>
            <img
              src={backdropUrl}
              alt={movie.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div className="relative z-20 container mx-auto px-4 py-6 sm:py-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center space-x-2 text-white bg-gray-900/50 hover:bg-gray-900/70 px-3 py-2 sm:px-4 rounded-lg transition-all duration-300 backdrop-blur-sm mb-6 sm:mb-8"
          >
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="text-sm sm:text-base">Back</span>
          </button>

          <div className="flex flex-col md:flex-row gap-6 sm:gap-8 mt-8 sm:mt-16">
            <div className="w-full md:w-1/3 flex-shrink-0">
              <img
                src={posterUrl}
                alt={movie.title}
                className="w-full max-w-sm mx-auto md:max-w-none rounded-xl shadow-2xl"
              />
            </div>

            <div className="w-full md:w-2/3 text-white">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-2">{movie.title}</h1>
              {movie.tagline && (
                <p className="text-lg sm:text-xl text-gray-300 italic mb-4 sm:mb-6">"{movie.tagline}"</p>
              )}

              <div className="flex flex-wrap items-center gap-3 sm:gap-6 mb-4 sm:mb-6">
                <div className="flex items-center space-x-2">
                  <Star className="w-5 h-5 sm:w-6 sm:h-6 fill-amber-400 text-amber-400" />
                  <span className="text-xl sm:text-2xl font-bold">{movie.vote_average.toFixed(1)}</span>
                  <span className="text-gray-400 text-sm sm:text-base">/10</span>
                </div>

                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                  <span className="text-base sm:text-lg">
                    {new Date(movie.release_date).getFullYear()}
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                  <span className="text-base sm:text-lg">{formatRuntime(movie.runtime)}</span>
                </div>

                <span className="px-3 py-1 bg-amber-500 text-white rounded-full text-xs sm:text-sm font-semibold">
                  {movie.status}
                </span>
              </div>

              <div className="mb-4 sm:mb-6">
                <div className="flex flex-wrap gap-2">
                  {movie.genres.map((genre) => (
                    <span
                      key={genre.id}
                      className="px-3 sm:px-4 py-1.5 sm:py-2 bg-white/10 backdrop-blur-sm rounded-full text-xs sm:text-sm font-medium"
                    >
                      {genre.name}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mb-6 sm:mb-8">
                <h2 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-3">Overview</h2>
                <p className="text-base sm:text-lg text-gray-200 leading-relaxed">{movie.overview}</p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <button
                  onClick={handleWatchTrailer}
                  className="w-full sm:w-auto flex items-center justify-center space-x-2 bg-white hover:bg-gray-100 text-gray-900 px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold text-base sm:text-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <Play className="w-5 h-5 sm:w-6 sm:h-6" />
                  <span>Watch Trailer</span>
                </button>

                <button
                  onClick={() => {
                    if (!bookingStore.currentSelection.cinemaId) {
                      toast.error('Please select a cinema first from the home page');
                      navigate('/');
                      return;
                    }
                    setShowModal(true);
                  }}
                  className="w-full sm:w-auto flex items-center justify-center space-x-2 bg-amber-500 hover:bg-amber-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold text-base sm:text-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <Film className="w-5 h-5 sm:w-6 sm:h-6" />
                  <span>View Showtimes</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 sm:py-12">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 sm:mb-8">Cast</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
          {movie.cast.map((actor) => (
            <div
              key={actor.id}
              className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="aspect-[2/3] overflow-hidden bg-gray-200">
                {actor.profile_path ? (
                  <img
                    src={`https://image.tmdb.org/t/p/w300${actor.profile_path}`}
                    alt={actor.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-300 to-gray-400 text-gray-600 font-bold text-2xl sm:text-4xl">
                    {actor.name.charAt(0)}
                  </div>
                )}
              </div>
              <div className="p-2 sm:p-3">
                <h3 className="font-bold text-gray-900 text-xs sm:text-sm line-clamp-2 mb-1">
                  {actor.name}
                </h3>
                <p className="text-xs text-gray-600 line-clamp-2">{actor.character}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showModal && movie && bookingStore.currentSelection.cinemaId && (
        <ShowtimeSelectionModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          movieId={id!}
          movieTitle={movie.title}
          moviePoster={posterUrl}
          cinemaId={bookingStore.currentSelection.cinemaId}
          cinemaName={bookingStore.currentSelection.cinemaName || ''}
        />
      )}

      {trailerKey && (
        <TrailerModal
          isOpen={showTrailerModal}
          onClose={() => setShowTrailerModal(false)}
          trailerKey={trailerKey}
          movieTitle={movie?.title || ''}
        />
      )}
    </div>
  );
}
