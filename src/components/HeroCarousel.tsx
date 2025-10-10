import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, Play, Star } from 'lucide-react';
import { Movie, getMovieVideos } from '../services/omdbApi';
import TrailerModal from './TrailerModal';
import toast from 'react-hot-toast';

interface HeroCarouselProps {
  movies: Movie[];
}

export default function HeroCarousel({ movies }: HeroCarouselProps) {
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
    <div className="relative w-full h-[50vh] md:h-[70vh] overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center transition-all duration-700 ease-in-out"
        style={{
          backgroundImage: `url(${backdropUrl})`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent" />
      </div>

      <div className="relative h-full container mx-auto px-4 flex items-center">
        <div className="max-w-2xl text-white space-y-4">
          <h1 className="text-4xl md:text-6xl font-bold leading-tight">
            {currentMovie.title}
          </h1>

          <div className="flex items-center space-x-4 text-sm md:text-base">
            <div className="flex items-center space-x-1">
              <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
              <span className="font-semibold">
                {currentMovie.vote_average.toFixed(1)}
              </span>
            </div>
            <span>•</span>
            <span>{currentMovie.release_date?.split('-')[0]}</span>
          </div>

          <p className="text-sm md:text-lg text-gray-200 line-clamp-3">
            {currentMovie.overview}
          </p>

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
            className="bg-amber-500 hover:bg-amber-600 disabled:bg-amber-400 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-300 flex items-center space-x-2"
          >
            <Play className="w-5 h-5 fill-white" />
            <span>{loadingTrailer ? 'Loading...' : 'Watch Trailer'}</span>
          </button>
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
