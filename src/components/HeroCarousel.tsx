import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Play, Star, Info } from 'lucide-react';
import { Movie, getMovieVideos } from '../services/omdbApi';
import TrailerModal from './TrailerModal';
import toast from 'react-hot-toast';

interface HeroCarouselProps {
  movies: Movie[];
}

export default function HeroCarousel({ movies }: HeroCarouselProps) {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showTrailerModal, setShowTrailerModal] = useState(false);
  const [trailerKey, setTrailerKey] = useState<string | null>(null);
  const [loadingTrailer, setLoadingTrailer] = useState(false);

  useEffect(() => {
    if (movies.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % movies.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [movies.length]);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + movies.length) % movies.length);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % movies.length);
  };

  if (movies.length === 0) return null;

  const currentMovie = movies[currentIndex];
  const backdropUrl = currentMovie.backdrop_path
    ? `https://image.tmdb.org/t/p/original${currentMovie.backdrop_path}`
    : `https://image.tmdb.org/t/p/original${currentMovie.poster_path}`;

  return (
    <div className="relative w-full h-[60vh] sm:h-[70vh] md:h-[85vh] overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center transition-all duration-1000 ease-in-out"
        style={{
          backgroundImage: `url(${backdropUrl})`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
      </div>

      <div className="relative h-full container mx-auto px-4 sm:px-6 flex items-center">
        <div className="max-w-3xl text-white space-y-4 sm:space-y-6 animate-fadeIn">
          <div className="inline-block">
            <span className="bg-amber-500 text-white px-4 py-1 rounded-full text-xs sm:text-sm font-bold uppercase tracking-wide">
              Featured
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-7xl font-bold leading-tight drop-shadow-2xl">
            {currentMovie.title}
          </h1>

          <div className="flex items-center space-x-4 sm:space-x-6 text-sm sm:text-base">
            <div className="flex items-center space-x-2 bg-amber-500/90 px-3 py-1.5 rounded-full">
              <Star className="w-4 h-4 sm:w-5 sm:h-5 text-white fill-white" />
              <span className="font-bold">
                {currentMovie.vote_average.toFixed(1)}
              </span>
            </div>
            <span className="text-gray-300">•</span>
            <span className="font-semibold">{currentMovie.release_date?.split('-')[0]}</span>
          </div>

          <p className="text-base sm:text-lg md:text-xl text-gray-200 line-clamp-3 leading-relaxed max-w-2xl">
            {currentMovie.overview}
          </p>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-2">
            <button
              onClick={async () => {
                setLoadingTrailer(true);
                try {
                  const videos = await getMovieVideos(currentMovie.id);
                  const trailer = videos.results?.find(
                    (video: any) => video.type === 'Trailer' && video.site === 'YouTube'
                  );
                  if (trailer) {
                    setTrailerKey(trailer.key);
                    setShowTrailerModal(true);
                  } else {
                    toast.error('No trailer available for this movie');
                  }
                } catch (error) {
                  toast.error('Failed to load trailer');
                } finally {
                  setLoadingTrailer(false);
                }
              }}
              disabled={loadingTrailer}
              className="bg-amber-500 hover:bg-amber-600 disabled:bg-amber-400 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-bold text-base sm:text-lg transition-all duration-300 flex items-center justify-center space-x-2 shadow-xl hover:shadow-2xl transform hover:scale-105"
            >
              <Play className="w-5 h-5 sm:w-6 sm:h-6 fill-white" />
              <span>{loadingTrailer ? 'Loading...' : 'Watch Trailer'}</span>
            </button>

            <button
              onClick={() => navigate(`/movie/${currentMovie.id}`)}
              className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-bold text-base sm:text-lg transition-all duration-300 flex items-center justify-center space-x-2 border-2 border-white/50 hover:border-white shadow-xl hover:shadow-2xl transform hover:scale-105"
            >
              <Info className="w-5 h-5 sm:w-6 sm:h-6" />
              <span>More Info</span>
            </button>
          </div>
        </div>
      </div>

      <button
        onClick={goToPrevious}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/80 text-white p-2 rounded-full transition-colors duration-300"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      <button
        onClick={goToNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/80 text-white p-2 rounded-full transition-colors duration-300"
        aria-label="Next slide"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-2">
        {movies.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === currentIndex
                ? 'bg-amber-500 w-8'
                : 'bg-white/50 hover:bg-white/80'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {trailerKey && (
        <TrailerModal
          isOpen={showTrailerModal}
          onClose={() => {
            setShowTrailerModal(false);
            setTrailerKey(null);
          }}
          trailerKey={trailerKey}
          movieTitle={currentMovie.title}
        />
      )}
    </div>
  );
}
