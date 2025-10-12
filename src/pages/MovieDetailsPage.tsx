import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, Star, Loader, Film, Play, User } from 'lucide-react';
import { getMovieDetailsWithCredits, getMovieVideos, MovieDetailsWithCredits, getMovieReviews, MovieReview, getSimilarMovies, Movie } from '../services/omdbApi';
import { useBookingStore } from '../store/bookingStore';
import ShowtimeSelectionModal from '../components/ShowtimeSelectionModal';
import CinemaSelectionModal from '../components/CinemaSelectionModal';
import TrailerModal from '../components/TrailerModal';
import { Cinema } from '../services/api';
import toast from 'react-hot-toast';

export default function MovieDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [movie, setMovie] = useState<MovieDetailsWithCredits | null>(null);
  const [reviews, setReviews] = useState<MovieReview[]>([]);
  const [similarMovies, setSimilarMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCinemaModal, setShowCinemaModal] = useState(false);
  const [showShowtimeModal, setShowShowtimeModal] = useState(false);
  const [selectedCinema, setSelectedCinema] = useState<Cinema | null>(null);
  const [showTrailerModal, setShowTrailerModal] = useState(false);
  const [trailerKey, setTrailerKey] = useState<string | null>(null);
  const [expandedReviews, setExpandedReviews] = useState<Set<string>>(new Set());
  const bookingStore = useBookingStore();

  useEffect(() => {
    if (!id) {
      navigate('/');
      return;
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
    loadMovieDetails();
  }, [id]);

  const loadMovieDetails = async () => {
    setLoading(true);
    try {
      const movieId = parseInt(id!);
      const [details, videos, reviewsData, similar] = await Promise.all([
        getMovieDetailsWithCredits(movieId),
        getMovieVideos(movieId),
        getMovieReviews(movieId),
        getSimilarMovies(movieId),
      ]);

      setMovie(details);
      setReviews(reviewsData);
      setSimilarMovies(similar);

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

  const toggleReviewExpansion = (reviewId: string) => {
    setExpandedReviews(prev => {
      const newSet = new Set(prev);
      if (newSet.has(reviewId)) {
        newSet.delete(reviewId);
      } else {
        newSet.add(reviewId);
      }
      return newSet;
    });
  };

  const truncateText = (text: string, maxLength: number = 300) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + '...';
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
                  onClick={() => setShowCinemaModal(true)}
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
        <div className="flex overflow-x-auto pb-4 gap-6 scrollbar-hide">
          {movie.cast.slice(0, 12).map((actor) => (
            <div
              key={actor.id}
              className="flex-shrink-0 w-28 sm:w-32 text-center group"
            >
              <div className="relative mb-3">
                <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden border-4 border-gray-200 shadow-lg group-hover:border-amber-400 transition-all duration-300">
                  {actor.profile_path ? (
                    <img
                      src={`https://image.tmdb.org/t/p/w300${actor.profile_path}`}
                      alt={actor.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-amber-100 to-amber-200 text-amber-600 font-bold text-3xl sm:text-4xl">
                      {actor.name.charAt(0)}
                    </div>
                  )}
                </div>
              </div>
              <h3 className="font-semibold text-gray-900 text-sm line-clamp-2 mb-1 px-1">
                {actor.name}
              </h3>
              <p className="text-xs text-gray-600 line-clamp-2 px-1">{actor.character}</p>
            </div>
          ))}
        </div>
      </div>

      {reviews.length > 0 && (
        <div className="container mx-auto px-4 py-8 sm:py-12 bg-gray-50">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 sm:mb-8">Top Reviews</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {reviews.map((review) => {
              const isExpanded = expandedReviews.has(review.id);
              const displayContent = isExpanded
                ? review.content
                : truncateText(review.content, 300);
              const shouldShowReadMore = review.content.length > 300;

              return (
                <div
                  key={review.id}
                  className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-white font-bold text-lg">
                        {review.author_details.username
                          ? review.author_details.username.charAt(0).toUpperCase()
                          : <User className="w-6 h-6" />
                        }
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {review.author_details.name || review.author_details.username || review.author}
                        </h3>
                        <p className="text-xs text-gray-500">
                          {new Date(review.created_at).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </p>
                      </div>
                    </div>
                    {review.author_details.rating && (
                      <div className="flex items-center space-x-1 bg-amber-100 px-3 py-1 rounded-full">
                        <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                        <span className="text-sm font-bold text-amber-700">
                          {review.author_details.rating.toFixed(1)}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="text-gray-700 text-sm leading-relaxed whitespace-pre-line">
                    {displayContent}
                  </div>
                  {shouldShowReadMore && (
                    <button
                      onClick={() => toggleReviewExpansion(review.id)}
                      className="mt-3 text-amber-600 hover:text-amber-700 font-medium text-sm transition-colors"
                    >
                      {isExpanded ? 'Read less' : 'Read more'}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {similarMovies.length > 0 && (
        <div className="container mx-auto px-4 py-8 sm:py-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 sm:mb-8">You Might Also Like</h2>
          <div className="flex overflow-x-auto pb-4 gap-4 scrollbar-hide snap-x snap-mandatory">
            {similarMovies.map((similarMovie) => {
              const posterUrl = similarMovie.poster_path
                ? `https://image.tmdb.org/t/p/w500${similarMovie.poster_path}`
                : 'https://via.placeholder.com/300x450?text=No+Poster';

              return (
                <div
                  key={similarMovie.id}
                  onClick={() => navigate(`/movie/${similarMovie.id}`)}
                  className="flex-shrink-0 w-40 sm:w-48 snap-start cursor-pointer group"
                >
                  <div className="relative overflow-hidden rounded-lg shadow-lg group-hover:shadow-2xl transition-all duration-300 transform group-hover:scale-105">
                    <img
                      src={posterUrl}
                      alt={similarMovie.title}
                      className="w-full aspect-[2/3] object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="absolute bottom-0 left-0 right-0 p-3">
                        <div className="flex items-center space-x-1 mb-2">
                          <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                          <span className="text-white font-bold text-sm">
                            {similarMovie.vote_average.toFixed(1)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-3">
                    <h3 className="font-semibold text-gray-900 text-sm line-clamp-2 mb-1">
                      {similarMovie.title}
                    </h3>
                    <p className="text-xs text-gray-600">
                      {similarMovie.release_date ? new Date(similarMovie.release_date).getFullYear() : 'N/A'}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <CinemaSelectionModal
        isOpen={showCinemaModal}
        onClose={() => setShowCinemaModal(false)}
        onSelectCinema={(cinema) => {
          setSelectedCinema(cinema);
          bookingStore.setCurrentCinema(cinema.id, cinema.name);
          setShowCinemaModal(false);
          setShowShowtimeModal(true);
        }}
        movieTitle={movie?.title || ''}
      />

      {showShowtimeModal && movie && selectedCinema && (
        <ShowtimeSelectionModal
          isOpen={showShowtimeModal}
          onClose={() => {
            setShowShowtimeModal(false);
            setSelectedCinema(null);
          }}
          movieId={id!}
          movieTitle={movie.title}
          moviePoster={posterUrl}
          cinemaId={selectedCinema.id}
          cinemaName={selectedCinema.name}
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
